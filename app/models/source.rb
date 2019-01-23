class Source < ApplicationRecord
  has_one :single_feed_source
  has_one :feed, through: :single_feed_source

  def update_episodes
    if source_type == 'rss'
      DownloadFeedJob.perform_later(id)
    elsif source_type == 'youtube'
      DownloadYoutubePlaylistJob.perform_later(id)
    else
      raise 'Unknown source type'
    end
  end

  def as_json(args)
    super(include: { feed: { only: [:id] } })
  end
end
