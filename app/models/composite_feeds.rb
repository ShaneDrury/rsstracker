class CompositeFeeds
  def initialize(feeds)
    @feeds = feeds
  end

  def new_episodes
    sources.flat_map do |source|
      matching_episodes = source.new_episodes.map do |episode|
        feed = source.matching_feed(episode.title)
        [feed, source, episode]
      end
      matching_episodes.select do |feed, _, _|
        feeds.include?(feed)
      end
    end
  end

  private

  attr_accessor :feeds

  def sources
    # TODO: Make into query or scope on feeds
    feeds.map(&:all_sources).flatten.uniq
  end
end
