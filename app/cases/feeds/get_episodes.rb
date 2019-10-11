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
      feeds.sources.each do |source|
        UpdateSourceEpisodesJob.perform_later(source.id)
      end
    end

    private

    attr_accessor :feed_models

    def feeds
      CompositeFeeds.new(feed_models)
    end
  end
end
