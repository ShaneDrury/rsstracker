class YoutubeApi
  class YoutubeDlError < StandardError; end
  class DownloadError < YoutubeDlError; end

  def initialize(youtube_dl_path)
    @youtube_dl_path = youtube_dl_path
  end

  def playlist(url)
    out = with_youtube_dl('--flat-playlist', '-j', '--', url)
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def details(url)
    JSON.parse(with_youtube_dl('-j', '--', url))
  end

  def download(url, quality, to:)
    begin
      with_youtube_dl('-f', quality, '-o', to, '-x', '--', url)
    rescue YoutubeDlError
      raise DownloadError.new("Could not download #{url} with quality #{quality} to #{tmp_path}")
    end
  end

  private

  attr_reader :youtube_dl_path

  def with_youtube_dl(*commands)
    out, status = Open3.capture2(youtube_dl_path, *commands)
    raise YoutubeDlError, "Error running #{commands}" if status.exitstatus != 0
    out
  end
end
