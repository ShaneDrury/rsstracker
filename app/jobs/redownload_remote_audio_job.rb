class RedownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Episode.find(episode_id).redownload
  end
end
