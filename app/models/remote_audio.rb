class RemoteAudio
  def initialize(episode)
    @episode = episode
  end

  def get
    # Add a .remote_audio method on episode for accessibility
    remote_audio_source.fetch(episode.url) do |f|
      episode.try_fetching do
        yield(f)
      end
    end
  end

  private

  attr_accessor :episode

  def remote_audio_source
    # Fix this, make YoutubeRemoteAudio and RemoteFileAudio
    # make them inherit from base or something
    # or move these outside and pass in the source
    case episode.source_type
    when :youtube
      YoutubeRemoteAudio.new
    when :rss
      RemoteFile.new
    else
      raise "Unknown source type"
    end
  end

  class YoutubeRemoteAudio
    def fetch(url, &block)
      youtube.download_audio_with_fallback(url, &block)
    end

    private

    def youtube
      @youtube ||= Youtube.new
    end
  end
end
