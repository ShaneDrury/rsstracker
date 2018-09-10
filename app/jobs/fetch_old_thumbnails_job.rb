class FetchOldThumbnailsJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    episodes = Feed.find(feed_id).episodes.where(thumbnail_url: nil)
    updater = YoutubeEpisodeUpdater.new(Rails.application.config.youtube_dl_path)
    episodes.each do |episode|
      updater.update(episode, episode.url)
      episode.save
      episode.feed.touch
      DownloadThumbnailJob.perform_later(episode.id)
    end
  end
end
