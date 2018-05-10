class FeedUpdateBroadcastJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    FeedsChannel.broadcast_to(feed, "hello")
    ActionCable
      .server
      .broadcast('feeds_channel',
        id: feed_id,
      )
  end
end
