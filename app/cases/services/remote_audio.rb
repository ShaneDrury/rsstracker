module Services
  class RemoteAudio
    def initialize(episode)
      @episode = episode
    end

    def fetch_and_attach
      return if episode.fetched?

      RemoteAudio.new(episode).get do |file|
        episode.attach_audio(file)
      end
    end

    def redownload
      return unless episode.fetched?

      episode.mark_as_not_asked!
      fetch_and_attach
    end

    private

    attr_accessor :episode
  end
end
