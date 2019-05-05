require "youtube"

class YoutubePlaylistDownloader
  def initialize(source_id, youtube_dl_path)
    @source_id = source_id
    @youtube_dl_path = youtube_dl_path
  end

  def download_playlist
    short_episode_details.each do |episode|
      url = episode.url
      description = episode.title
      feed = source.matching_feed(description)
      if !Episode.exists?(guid: url) && feed.present?
        CreateEpisodeFromYoutubeJob.perform_later(
          source_id,
          feed.id,
          url,
          description,
          youtube_dl_path
        )
      end
    end
    nil
  end

  private

  attr_reader :source_id, :youtube_dl_path

  def short_episode_details
    Youtube.new(youtube_dl_path).short_details(source.url)
  end

  def source
    @source ||= Source.find(source_id)
  end
end
