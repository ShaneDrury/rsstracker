module Downloading
  class GetRemoteAudio
    def initialize(episode)
      @episode = episode
    end

    def run
      return if episode.fetched?

      RemoteAudio.new(episode).get do |file|
        episode.attach_audio(file)
      end
    end

    private

    attr_accessor :episode
  end
end
