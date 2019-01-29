require "youtube_episode_updater"
require "youtube"

class YoutubePlaylistDownloader
  class EpisodeSaveFailure < StandardError; end

  def initialize(source_id, youtube_dl_path)
    @source_id = source_id
    @youtube_dl_path = youtube_dl_path
  end

  def download_playlist
    short_episode_details.each do |episode|
      CreateEpisodeFromYoutubeJob.perform_later(source_id, episode, youtube_dl_path)
    end
    nil
  end

  private

  attr_reader :source_id, :youtube_dl_path

  def short_episode_details
    Youtube.new(youtube_dl_path).short_details(source.url)
  end
end
