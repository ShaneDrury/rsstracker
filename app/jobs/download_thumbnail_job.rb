class DownloadThumbnailJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    Episode.find(episode_id).download_thumbnail
  end
end
