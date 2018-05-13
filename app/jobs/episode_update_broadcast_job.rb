class EpisodeUpdateBroadcastJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    episode = Episode.find(episode_id)
    ActionCable
      .server
      .broadcast(
        'feeds_channel',
        type: 'UPDATE_EPISODE',
        payload: {
          episode: episode
        }
      )
  end
end
