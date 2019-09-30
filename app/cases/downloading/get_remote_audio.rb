module Downloading
  class GetRemoteAudio
    def initialize(episode)
      @episode = episode
    end

    def run
      return if episode.fetched?

      remote_audio = RemoteAudio.new(episode)
      episode.try_fetching do # TODO: think about this
        remote_audio.get do |file|
          episode.attach_audio(file)
        end
      end
    end

    private

    attr_accessor :episode
  end
end
