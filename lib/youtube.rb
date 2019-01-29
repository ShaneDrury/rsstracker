class Youtube
  class YoutubeDlError < StandardError; end

  def initialize(youtube_dl_path)
    @youtube_dl_path = youtube_dl_path
  end

  def short_details(url)
    out = with_youtube_dl('--flat-playlist', '-j', '--', url)
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def details(url)
    out = with_youtube_dl('-j', '--', url)
    JSON.parse(out)
  end

  private

  attr_reader :youtube_dl_path

  def with_youtube_dl(*commands)
    out, status = Open3.capture2(youtube_dl_path, *commands)
    raise YoutubeDlError, "Error running #{commands}" if status.exitstatus != 0
    out
  end
end
