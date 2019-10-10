class UpdateSourceEpisodesJob < ApplicationJob
  queue_as :default

  def perform(source_id, feed_ids)
    source = Source.find(source_id)
    feeds = get_feeds(feed_ids)

    source.with_update do
      new_episodes(source, feeds).each do |remote_episode|
        feed = remote_episode.feed
        episode = feed.episodes.create_episode(remote_episode)
        next unless episode.should_download?

        DownloadThumbnailJob.perform_later(episode.id) if episode.source_thumbnail_url
        DownloadRemoteAudioJob.perform_later(episode.id) if feed.autodownload
      end
    end
  end

  private

  def new_episodes(source, feeds)
    RemoteEpisodes.new(source, feeds).new_episodes
  end

  def get_feeds(feed_ids)
    Feed.where(id: feed_ids)
  end
end
