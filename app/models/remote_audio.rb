class RemoteAudio
  def initialize(episode)
    @episode = episode
  end

  def get(&block)
    remote_audio_source.fetch(episode.url, &block)
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
