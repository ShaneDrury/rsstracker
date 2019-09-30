class DownloadRemoteAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Downloading::GetRemoteAudio.new(Episode.find(episode_id)).run
  end
end
