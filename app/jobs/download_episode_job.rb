# frozen_string_literal: true

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Episode.find(episode_id).attach_remote_file
  end
end
