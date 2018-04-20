require 'open-uri'
require 'rss'

class DownloadFeedJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    rss = RSS::Parser.parse(open(feed.url).read, false).items[0..5]
    rss.each do |result|
      Episode.find_or_create_by(feed: feed, name: result.title, guid: result.guid.content) do |ep|
        ep.build_fetch_status(status: 'NOT_ASKED')
        ep.url = result.link
        ep.save
      end
    end
  end
end
