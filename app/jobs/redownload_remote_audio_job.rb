class RedownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Downloading::RedownloadRemoteAudio.new(Episode.find(episode_id)).run
  end
end
