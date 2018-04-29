class DownloadYoutubePlaylistJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    unless ENV.include? 'YOUTUBE_DL_PATH'
      raise 'Must be run with YOUTUBE_DL_PATH env variable'
    end
    feed = Feed.find(feed_id)
    out = `#{ENV['YOUTUBE_DL_PATH']} --flat-playlist -j #{feed.url}`
    out.split("\n").each do |line|
      json = JSON.parse(line)
      description = json['title']
      url = json['url']
      pp description
      Episode.find_or_create_by(feed: feed, name: description, guid: url) do |ep|
        ep.build_fetch_status(status: 'NOT_ASKED')
        ep.url = url
        ep.save
      end
    end
    nil
  end
end
