class Youtube
  class YoutubeDlError < StandardError; end
  class DownloadError < YoutubeDlError; end

  FILENAME_FORMAT = '%(id)s.%(ext)s'

  def initialize(youtube_dl_path)
    @youtube_dl_path = youtube_dl_path
  end

  def short_details(url)
    out = with_youtube_dl('--flat-playlist', '-j', '--', url)
    json_out = out.split("\n").map { |line| JSON.parse(line) }
    json_out.map {|j| ShortEpisodeDetails.new(j["url"], j["title"]) }
  end

  def details(url)
    out = with_youtube_dl('-j', '--', url)
    json_out = JSON.parse(out)
    description = json_out['description']
    duration = Time.at(json_out['duration']).utc.strftime('%H:%M:%S')
    publication_date = Date.strptime(json_out['upload_date'], '%Y%m%d')
    thumbnail_url = json_out['thumbnail']
    EpisodeDetails.new(json_out['id'], description, duration, publication_date, thumbnail_url)
  end

  def download_audio(url, quality: "22")
    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, FILENAME_FORMAT)
      begin
        with_youtube_dl('-f', quality, '-o', tmp_path, '-x', '--', url)
      rescue YoutubeDlError
        raise DownloadError.new("Could not download #{url} with quality #{quality} to #{tmp_path}")
      end
      json_details = details(url)
      temp_file_path = File.join(temp_dir, "#{json_details.id}.m4a")
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

  EpisodeDetails = Struct.new(:id, :description, :duration, :publication_date, :thumbnail_url)
  ShortEpisodeDetails = Struct.new(:url, :title)
end
