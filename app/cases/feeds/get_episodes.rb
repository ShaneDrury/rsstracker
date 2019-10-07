module Feeds
  class GetEpisodes
    def self.all
      new(Feed.all)
    end

    def self.for(feed)
      new([feed])
    end

    def initialize(feed_models)
      @feed_models = feed_models
    end

    def run
      feeds.new_episodes do |feed, source, remote_episode|
        episode = feed.episodes.create_episode(source, remote_episode)
        next unless episode.should_download?

        DownloadThumbnailJob.perform_later(episode.id) if episode.source_thumbnail_url
        DownloadRemoteAudioJob.perform_later(episode.id) if feed.autodownload
      end
    end

    private

    attr_accessor :feed_models

    def feeds
      CompositeFeeds.new(feed_models)
    end
  end
end
