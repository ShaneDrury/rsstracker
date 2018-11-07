require "thumbnail_downloader"

class DownloadThumbnailJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    downloader = ::ThumbnailDownloader.new(episode_id, Rails.application.config.download_root)
    downloader.download
  end
end
