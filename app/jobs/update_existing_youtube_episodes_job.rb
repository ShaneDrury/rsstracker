class UpdateExistingYoutubeEpisodesJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    unless ENV.include? 'YOUTUBE_DL_PATH'
      raise 'Must be run with YOUTUBE_DL_PATH env variable'
    end
    feed = Feed.find(feed_id)
    eps = feed.episodes
            .joins(:fetch_status)
            .where(fetch_statuses: { status: 'NOT_ASKED' })
            .where(description: nil)
    updater = YoutubeEpisodeUpdater.new(ENV['YOUTUBE_DL_PATH'])
    eps.each do |ep|
      updater.update(ep, ep.url)
      ep.save
      feed.touch
    rescue IOError
      next
    end
  end
end
