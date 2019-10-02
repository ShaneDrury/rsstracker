class UpdateFeedJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    Feeds::GetEpisodes.new(Feed.find(feed_id)).run
  end
end
