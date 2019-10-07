class SourceUpdateStartedBroadcastJob < ApplicationJob
  queue_as :default

  def perform(source_id)
    ActionCable
      .server
      .broadcast(
        'feeds_channel',
        type: 'SOURCE_UPDATE_STARTED',
        payload: {
          sourceId: source_id,
        }
      )
  end
end
