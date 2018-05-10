class FeedsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'feeds_channel'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
