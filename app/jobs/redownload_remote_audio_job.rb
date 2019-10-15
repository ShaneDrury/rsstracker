class RedownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Services::RemoteAudio.new(Episode.find(episode_id)).redownload
  end
end
