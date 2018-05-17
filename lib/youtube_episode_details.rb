class YoutubeEpisodeDetails
  def initialize(url, youtube_dl_path)
    @url = url
    @youtube_dl_path = youtube_dl_path
  end

  def details
    out = `#{youtube_dl_path} -j -- #{url}`
    details = JSON.parse(out)
    description = details['description']
    duration = Time.at(details['duration']).utc.strftime('%H:%M:%S')
    publication_date = Date.strptime(details['upload_date'], '%Y%m%d')
    EpisodeDetails.new(description, duration, publication_date)
  end

  private

  attr_reader :url, :youtube_dl_path

  EpisodeDetails = Struct.new(:description, :duration, :publication_date)
end
