class DownloadYoutubeAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Episode.find(episode_id).attach_remote_youtube_audio
  end
end
