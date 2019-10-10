class RemoteEpisodes
  def initialize(source, feeds)
    @source = source
    @feeds = feeds
  end

  def new_episodes
    source
      .new_episodes
      .select { |episode| feeds.include?(episode.feed) }
  end

  private

  attr_accessor :source, :feeds
end
