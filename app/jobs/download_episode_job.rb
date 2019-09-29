# frozen_string_literal: true

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    episode = Episode.find(episode_id)
    return if episode.fetched?
    episode.set_as_loading!

    remote_file = RemoteFile.new(episode.url)
    remote_file.get do |audio_file|
      audio_attachment = episode.create_audio_attachment
      audio_attachment.audio = audio_file
      audio_attachment.save
    end

    episode.set_as_success!
  end
end
