class FeedUpdateBroadcastJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    ActionCable
      .server
      .broadcast(
        'feeds_channel',
        type: 'UPDATE_FEED',
        payload: {
          feed: ActiveModelSerializers::SerializableResource.new(feed).as_json,
        }
      )
  end
end
