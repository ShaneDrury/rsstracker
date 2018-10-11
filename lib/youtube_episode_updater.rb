require "youtube_episode_details"

class YoutubeEpisodeUpdater
  def initialize(youtube_dl_path)
    @youtube_dl_path = youtube_dl_path
  end

  def update(ep, url)
    details = full_details(url)
    ep.description = details.description
    ep.duration = details.duration
    ep.publication_date = details.publication_date
    ep.source_thumbnail_url = details.thumbnail_url
    ep.url = url
  end

  private

  attr_reader :youtube_dl_path

  def full_details(url)
    ::YoutubeEpisodeDetails.new(url, youtube_dl_path).details
  end
end

