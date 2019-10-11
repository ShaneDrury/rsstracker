class RemoteEpisodes
  def initialize(source)
    @source = source
  end

  def download_new
    source.with_update do
      new_episodes.each do |remote_episode|
        episode = remote_episode.create_episode
        next unless episode.should_download?

        DownloadThumbnailJob.perform_later(episode.id) if episode.source_thumbnail_url
        DownloadRemoteAudioJob.perform_later(episode.id) if remote_episode.feed.autodownload
      end
    end
  end

  private

  def new_episodes
    source.new_episodes.select { |episode| episode.feed.present? }
  end

  attr_accessor :source
end
