require "youtube_playlist_downloader"

class DownloadYoutubePlaylistJob < ApplicationJob
  queue_as :default

  def perform(source_id)
    downloader = ::YoutubePlaylistDownloader.new(source_id, Rails.application.config.youtube_dl_path)
    downloader.download_playlist
  end
end
