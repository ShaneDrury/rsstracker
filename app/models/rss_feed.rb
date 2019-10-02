require 'rss'

class RssFeed
  class RssError < StandardError; end

  def self.from_url(url)
    RSS::Parser.parse(open(url).read, false)
  end

  def initialize(url)
    @url = url
  end

  def episodes
    raise RssError, "RSS Feed was nil. Source id: #{source_id}" if rss.nil?

    rss.items.map { |item| RemoteRssEpisode.from_rss_episode(item) }
  end

  private

  attr_accessor :url

  def rss
    @rss ||= RSS::Parser.parse(open(url).read, false)
  end
end
