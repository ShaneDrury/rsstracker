# frozen_string_literal: true
class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy
  belongs_to :source
  has_one_attached :thumbnail
  has_one :audio_attachment, dependent: :destroy
  validates_uniqueness_of :guid

  default_scope { order(publication_date: :desc, created_at: :desc) }

  scope :duplicates_for, ->(episode) do
    where(name: episode.name, feed: episode.feed).where.not(id: episode.id)
  end

  scope :with_search_term, ->(term) do
    description = DbTextSearch::FullText.new(self, :description).search(term)
    name = DbTextSearch::FullText.new(self, :name).search(term)
    description.or(name)
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

  def should_download?
    !Episode.duplicates_for(self).exists?
  end

  def source_type
    source.source_type.to_sym
  end

  def fetched?
    fetch_status&.status == "SUCCESS"
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
    create_fetch_status!(status: 'NOT_ASKED')
  end

  def remote_audio
    @remote_audio ||= RemoteAudio.new(self)
  end

  def attach_audio(file)
    audio_attachment = create_audio_attachment
    audio_attachment.audio = file
    audio_attachment.save
  end

  def fetch_and_attach_remote_audio
    return if fetched?

    remote_audio.get do |file|
      try_fetching do
        attach_audio(file)
      end
    end
  end

  def redownload
    return unless fetched?

    mark_as_not_asked!
    fetch_and_attach_remote_audio
  end

  def download_thumbnail
    FileDownloader.get(source_thumbnail_url) do |input|
      thumbnail.attach(io: input, filename: "thumbnail.jpg", content_type: "image/jpeg")
    end
  end

  private

  def try_fetching
    mark_as_loading!
    yield
    mark_as_success!
  rescue StandardError => e
    mark_as_error!(e.to_s)
    raise e
  end
end
