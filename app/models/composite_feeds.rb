class CompositeFeeds
  def initialize(feeds)
    @feeds = feeds
  end

  def sources
    # TODO: Make into query or scope on feeds
    feeds.map(&:all_sources).flatten.uniq
  end

  private

  attr_accessor :feeds
end
