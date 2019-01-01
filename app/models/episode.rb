# frozen_string_literal: true
class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy
  belongs_to :source

  after_update_commit do
    EpisodeUpdateBroadcastJob.perform_later(id)
  end

  def image_link(request)
    "#{request.protocol}#{request.host}:#{request.port}#{relative_image_link}" if thumbnail_url
  end

  def relative_image_link
    "/uploads/#{feed_id}/#{thumbnail_url}" if thumbnail_url
  end

  def full_url
    source.type == 'youtube' ? "https://www.youtube.com/watch?v=#{url}" : url
  end

  def as_json(options={})
    super(include: { fetch_status: { methods: :percentage_fetched } }, methods: [:full_url, :relative_image_link])
  end
end
