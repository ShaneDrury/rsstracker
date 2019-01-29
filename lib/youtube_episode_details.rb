require "youtube"

class YoutubeEpisodeDetails
  def initialize(url, youtube_dl_path)
    @url = url
    @youtube_dl_path = youtube_dl_path
  end

  def details
    details = Youtube.new(youtube_dl_path).details(url)
    description = details['description']
    duration = Time.at(details['duration']).utc.strftime('%H:%M:%S')
    publication_date = Date.strptime(details['upload_date'], '%Y%m%d')
    thumbnail_url = details['thumbnail']
    EpisodeDetails.new(description, duration, publication_date, thumbnail_url)
  end

  private

  attr_reader :url, :youtube_dl_path

  EpisodeDetails = Struct.new(:description, :duration, :publication_date, :thumbnail_url)
end
