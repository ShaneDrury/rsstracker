require "youtube_api"

class Youtube
  FILENAME_FORMAT = '%(id)s.%(ext)s'

  def short_details(url)
    json_out = api.playlist(url)
    json_out.map { |j| ShortEpisodeDetails.new(j["url"], j["title"]) }
  end

  def details(url)
    out = api.details(url)
    description = out['description']
    duration = Time.at(out['duration']).utc.strftime('%H:%M:%S')
    publication_date = Date.strptime(out['upload_date'], '%Y%m%d')
    thumbnail_url = out['thumbnail']
    EpisodeDetails.new(out['id'], description, duration, publication_date, thumbnail_url)
  end

  def download_audio(url, quality: "22")
    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, FILENAME_FORMAT)
      api.download(url, quality, to: tmp_path)
      json_details = details(url)
      temp_file_path = File.join(temp_dir, "#{json_details.id}.m4a")
      yield File.open(temp_file_path, binmode: true), json_details
    end
  end

  def download_audio_with_fallback(url, &block)
    download_audio(url, quality: "22", &block)
  rescue YoutubeApi::DownloadError
    download_audio(url, quality: "18", &block)
  end

  private

  def api
    @api ||= YoutubeApi.new
  end

  EpisodeDetails = Struct.new(:id, :description, :duration, :publication_date, :thumbnail_url)
  ShortEpisodeDetails = Struct.new(:url, :title)
end
