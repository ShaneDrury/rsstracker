module Feeds
  class GetEpisodes
    def initialize(feed)
      @feed = feed
    end

    def run
      feed.new_episodes.each do |source, remote_episode|
        episode = feed.episodes.create_episode(source, remote_episode)
        next unless episode.should_download?

        DownloadThumbnailJob.perform_later(episode.id) if episode.thumbnail_url
        DownloadRemoteAudioJob.perform_later(episode.id) if feed.autodownload
      end
    end

    private

    attr_accessor :feed
  end
end
