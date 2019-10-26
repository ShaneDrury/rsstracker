# frozen_string_literal: true
class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy
  belongs_to :source
  has_one_attached :thumbnail
  has_one :audio_attachment, dependent: :destroy
  validates_uniqueness_of :guid
  after_create :mark_as_not_asked!

  default_scope { order(publication_date: :desc, created_at: :desc) }

  scope :duplicates_for, ->(episode) do
    where(name: episode.name, feed: episode.feed).where.not(id: episode.id)
  end

  scope :with_search_term, ->(term) do
    description = DbTextSearch::FullText.new(self, :description).search(term)
    name = DbTextSearch::FullText.new(self, :name).search(term)
    description.or(name)
  end

  def self.create_from_remote_episode!(remote_episode)
    create!(
      feed: remote_episode.feed,
      guid: remote_episode.guid,
      source: remote_episode.source,
      name: remote_episode.title,
      description: remote_episode.description,
      duration: remote_episode.duration,
      file_size: remote_episode.file_size,
      publication_date: remote_episode.publication_date,
      source_thumbnail_url: remote_episode.thumbnail_url,
      url: remote_episode.url,
      seen: false,
    )
  end

  after_update_commit do
    EpisodeUpdateBroadcastJob.perform_later(id)
  end

  def full_url
    source.youtube? ? "https://www.youtube.com/watch?v=#{url}" : url
  end

  def small_thumbnail
    thumbnail.variant(combine_options: { resize: "128x72>", extent: "128x72", background: "white", gravity: "center"}) if thumbnail.attached?
  end

  def audio_url
    File.join(Rails.application.config.storage_root, "shrine", audio_attachment.audio_url) if audio_attachment&.audio_url&.present?
  end

  def source_type
    source.source_type.to_sym
  end

  def fetch_and_attach_remote_audio
    return if fetched?
    try_fetching do
      remote_audio.get do |file|
        attach_audio(file)
      end
    end
  end

  def redownload
    return unless fetched?

    audio_attachment.destroy!
    mark_as_not_asked!
    fetch_and_attach_remote_audio
  end

  def download_if_needed
    return unless should_download?

    DownloadThumbnailJob.perform_later(id) if source_thumbnail_url
    DownloadRemoteAudioJob.perform_later(id) if feed.autodownload
  end

  def download_thumbnail
    FileDownloader.get(source_thumbnail_url) do |input|
      thumbnail.attach(io: input, filename: "thumbnail.jpg", content_type: "image/jpeg")
    end
  end

  private

  def remote_audio
    @remote_audio ||= RemoteAudio.new(self)
  end

  def attach_audio(file)
    audio_attachment = create_audio_attachment
    audio_attachment.audio = file
    audio_attachment.save
  end

  def try_fetching
    mark_as_loading!
    yield
    mark_as_success!
  rescue StandardError => e
    mark_as_error!(e.to_s)
    raise e
  end

  def mark_as_loading!
    create_fetch_status(status: 'LOADING')
  end

  def mark_as_success!
    create_fetch_status(status: 'SUCCESS')
  end

  def mark_as_error!(reason)
    create_fetch_status(status: 'FAILURE', error_reason: reason)
  end

  def mark_as_not_asked!
    create_fetch_status(status: 'NOT_ASKED')
  end

  def fetched?
    fetch_status&.status == "SUCCESS"
  end

  def should_download?
    !Episode.duplicates_for(self).exists?
  end
end
