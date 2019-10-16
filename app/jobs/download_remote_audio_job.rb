class DownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Episode.find(episode_id).fetch_and_attach_remote_audio
  end
end
