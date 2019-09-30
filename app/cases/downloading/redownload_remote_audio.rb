module Downloading
  class RedownloadRemoteAudio
    def initialize(episode)
      @episode = episode
    end

    def run
      return unless episode.fetched?

      episode.mark_as_not_asked!
      Downloading::GetRemoteAudio.new(episode).run
    end

    private

    attr_accessor :episode
  end
end
