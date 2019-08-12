require "youtube_episode_updater"

class UpdateExistingYoutubeEpisodesJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    eps = feed.episodes
            .joins(:fetch_status)
            .where(fetch_statuses: { status: 'NOT_ASKED' })
            .where(description: nil)
    updater = YoutubeEpisodeUpdater.new
    eps.each do |ep|
      updater.update(ep, ep.url)
      ep.save
      feed.touch
    rescue IOError
      next
    end
  end
end
