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

  def download!
    if source.rss?
      DownloadEpisodeJob.perform_later(id)
    elsif source.youtube?
      DownloadYoutubeAudioJob.perform_later(id)
    else
      raise "Unknown source type"
    end
  end

  def redownload!
    return if fetch_status&.status != "SUCCESS"
    create_fetch_status!(status: 'NOT_ASKED')
    download!
  end

  def fetched?
    fetch_status&.status == "SUCCESS"
  end

  def set_as_loading!
    build_fetch_status(status: 'LOADING').save
  end
end
