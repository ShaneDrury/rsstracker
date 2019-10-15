class DownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Services::RemoteAudio.new(Episode.find(episode_id)).fetch_and_attach
  end
end
