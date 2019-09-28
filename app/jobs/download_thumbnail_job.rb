require "thumbnail_downloader"

class DownloadThumbnailJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    episode = Episode.find(episode_id)
    downloader = ::ThumbnailDownloader.new(episode)
    downloader.download
  end
end
