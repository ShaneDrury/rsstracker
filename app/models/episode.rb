# frozen_string_literal: true
class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy
  belongs_to :source
  has_one_attached :thumbnail
  has_one :audio_attachment, dependent: :destroy

  default_scope { order(publication_date: :desc, created_at: :desc) }

  scope :duplicates_for, ->(episode) do
    where(name: episode.name, feed: episode.feed).where.not(id: episode.id)
  end

  after_update_commit do
    EpisodeUpdateBroadcastJob.perform_later(id)
  end

  def image_link(request)
    "#{request.protocol}#{request.host}:#{request.port}#{relative_image_link}" if thumbnail_url
  end

  def full_url
    source.source_type == 'youtube' ? "https://www.youtube.com/watch?v=#{url}" : url
  end

  def small_thumbnail
    thumbnail.variant(resize: "128x128") if thumbnail.attached?
  end

  def audio_url
    File.join(Rails.application.config.storage_root, "shrine", audio_attachment.audio_url) if audio_attachment&.audio&.exists?
  end
end
