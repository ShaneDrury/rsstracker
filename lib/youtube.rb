class Youtube
  class YoutubeDlError < StandardError; end
  class DownloadError < YoutubeDlError; end

  FILENAME_FORMAT = '%(id)s.%(ext)s'

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

  def download_audio(url, quality: "22")
    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, FILENAME_FORMAT)
      begin
        with_youtube_dl('-f', quality, '-o', tmp_path, '-x', '--', url)
      rescue YoutubeDlError
        raise DownloadError("Could not download #{url} with quality #{quality} to #{tmp_path}")
      end
      json_details = details(url)
      temp_file_path = File.join(temp_dir, "#{json_details['id']}.m4a")
      yield File.open(temp_file_path, binmode: true), json_details
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
