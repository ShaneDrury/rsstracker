class CompositeFeeds
  def initialize(feeds)
    @feeds = feeds
  end

  def new_episodes
    mapper(sources).map do |source|
      # This should fire off a SOURCE_UPDATING event
      matching_episodes = source.new_episodes.map do |episode|
        feed = source.matching_feed(episode.title)
        [feed, source, episode]
      end
      matching_episodes
        .select { |feed, _, _| feeds.include?(feed) }
        .map { |feed, src, episode| yield(feed, src, episode) }
    end
  end

  private

  attr_accessor :feeds

  def mapper(enumerable)
    @mapper ||= Mapping::MParallel.new(enumerable)
  end

  def sources
    # TODO: Make into query or scope on feeds
    feeds.map(&:all_sources).flatten.uniq
  end
end
