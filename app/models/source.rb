class Source < ApplicationRecord
  has_one :single_feed_source
  has_one :feed, through: :single_feed_source
  has_many :feed_guesses
  has_many :feeds, through: :feed_guesses

  scope :for_feed, ->(feed_id) do
    # TODO: Remove dupes
    left_joins(:feed_guesses, :single_feed_source)
      .where("feed_guesses.feed_id = ? OR single_feed_sources.feed_id = ?", feed_id, feed_id)
  end

  def youtube?
    source_type == "youtube"
  end

  def rss?
    source_type == "rss"
  end

  def matching_feed(title = nil)
    if feed.present?
      feed
    elsif feed_guesses.exists?
      feed_guesses.detect { |guess| guess.matches_text?(title) }&.feed
    end
  end

  def download_new
    with_update do
      new_episodes.each do |remote_episode|
        episode = remote_episode.create_episode!
        episode.download_if_needed
      end
    end
  end

  private

  def new_episodes
    guids = remote_episodes.map(&:url)
    # Bit dodgy, maximum 32k values here in the where(guid: guids)
    # better to chunk?
    existing_guids = Episode.where(guid: guids).pluck(:guid)
    new_guids = guids - existing_guids
    remote_episodes.select do |episode|
      new_guids.include?(episode.url) && episode.feed.present?
    end
  end

  def with_update
    SourceUpdateStartedBroadcastJob.perform_later(id)
    result = yield
    SourceUpdateCompleteBroadcastJob.perform_later(id)
    result
  end

  def remote_episodes
    @remote_episodes ||= remote.episodes
  end

  def remote
    if rss?
      RssFeed.new(url, self)
    elsif youtube?
      YoutubePlaylist.new(url, self)
    else
      raise 'Unknown source type'
    end
  end
end
