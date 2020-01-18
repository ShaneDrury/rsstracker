require 'rss'

class RssFeed
  class RssError < StandardError; end

  def initialize(url, source)
    @url = url
    @source = source
  end

  def episodes
    raise RssError, "RSS Feed was nil. Source id: #{source_id}" if rss.nil?

    rss.items.map { |item| RemoteRssEpisode.new(item, source) }
  end

  private

  attr_accessor :url, :source

  def rss
    @rss ||= RSS::Parser.parse(open(url).read, false)
  end
end
