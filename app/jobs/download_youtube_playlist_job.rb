require "youtube_playlist_downloader"

class DownloadYoutubePlaylistJob < ApplicationJob
  queue_as :default

  def perform(source_id)
    downloader = ::YoutubePlaylistDownloader.new(source_id)
    downloader.download_playlist
  end
end
