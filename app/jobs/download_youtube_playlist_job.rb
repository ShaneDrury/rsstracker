class DownloadYoutubePlaylistJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    unless ENV.include? 'YOUTUBE_DL_PATH'
      raise 'Must be run with YOUTUBE_DL_PATH env variable'
    end
    downloader = YoutubePlaylistDownloader.new(feed_id, ENV['YOUTUBE_DL_PATH'])
    downloader.download_playlist
  end
end
