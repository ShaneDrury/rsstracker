require 'open-uri'
require 'rss'

class UpdatePublicationDateJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    rss = RSS::Parser.parse(open(feed.url).read, false)

    rss.items.each do |result|
      ep = Episode.find_by(feed: feed, guid: result.guid.content)
      ep.publication_date = result.pubDate
      ep.save
    end
    nil
  end
end
