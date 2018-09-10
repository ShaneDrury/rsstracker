class DownloadThumbnailJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    downloader = ThumbnailDownloader.new(episode_id, Rails.application.config.download_root, Rails.application.config.storage_root)
    downloader.download
  end
end
