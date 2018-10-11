require "youtube_playlist_downloader"

class DownloadYoutubePlaylistJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    downloader = ::YoutubePlaylistDownloader.new(feed_id, Rails.application.config.youtube_dl_path)
    downloader.download_playlist
  end
end
