class RemoteEpisodes
  def initialize(source, feeds)
    @source = source
    @feeds = feeds
  end

  def download_new
    source.with_update do
      new.each do |remote_episode|
        feed = remote_episode.feed
        episode = feed.episodes.create_episode(remote_episode)
        next unless episode.should_download?

        DownloadThumbnailJob.perform_later(episode.id) if episode.source_thumbnail_url
        DownloadRemoteAudioJob.perform_later(episode.id) if feed.autodownload
      end
    end
  end

  def new
    source
      .new_episodes
      .select { |episode| feeds.include?(episode.feed) }
  end

  private

  attr_accessor :source, :feeds
end
