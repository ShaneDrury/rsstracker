class RemoteAudio
  def initialize(episode)
    @episode = episode
  end

  def get
    handler = lambda do |f|
      episode.try_fetching do
        yield(f)
      end
    end

    case source_type
    when :youtube
      youtube.download_audio_with_fallback(episode.url, &handler)
    when :rss
      remote_file.get(&handler)
    else
      raise "Unknown source type"
    end
  end

  private

  attr_accessor :episode

  def source_type
    episode.source_type
  end

  def youtube
    @youtube ||= Youtube.new
  end

  def remote_file
    @remote_file ||= RemoteFile.new(episode.url)
  end
end
