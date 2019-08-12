require "youtube"

class YoutubePlaylistDownloader
  def initialize(source_id)
    @source_id = source_id
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
        )
      end
    end
    nil
  end

  private

  attr_reader :source_id

  def short_episode_details
    Youtube.new.short_details(source.url)
  end

  def source
    @source ||= Source.find(source_id)
  end
end
