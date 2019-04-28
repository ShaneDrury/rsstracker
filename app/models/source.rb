class Source < ApplicationRecord
  has_one :single_feed_source
  has_one :feed, through: :single_feed_source
  has_many :feed_guesses
  has_many :feeds, through: :feed_guesses

  scope :for_feed, ->(feed_id) do
    left_joins(:feed_guesses, :single_feed_source)
      .where("feed_guesses.feed_id = ? OR single_feed_sources.feed_id = ?", feed_id, feed_id)
  end

  def update_episodes
    if source_type == 'rss'
      DownloadFeedJob.perform_later(id)
    elsif source_type == 'youtube'
      DownloadYoutubePlaylistJob.perform_later(id)
    else
      raise 'Unknown source type'
    end
  end
end
