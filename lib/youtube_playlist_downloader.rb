require "youtube_episode_updater"

class YoutubePlaylistDownloader
  class EpisodeSaveFailure < StandardError; end

  def initialize(feed_id, youtube_dl_path)
    @feed_id = feed_id
    @youtube_dl_path = youtube_dl_path
  end

  def download_playlist
    short_episode_details.each do |episode|
      update_or_create_episode(episode)
    end
    nil
  end

  private

  attr_reader :feed_id, :youtube_dl_path

  def update_or_create_episode(episode)
    url = episode['url']
    description = episode['title']
    updater = ::YoutubeEpisodeUpdater.new(youtube_dl_path)
    Episode.find_or_create_by(guid: url) do |ep|
      ep.build_fetch_status(status: 'NOT_ASKED')
      ep.feed = feed
      ep.name = description
      begin
        updater.update(ep, url)
      rescue IOError
        break
      end
      ep.seen = false
      raise EpisodeSaveFailure, ep.errors.full_messages unless ep.save
      feed.touch
      DownloadThumbnailJob.perform_later(ep.id)
      DownloadYoutubeAudioJob.perform_later(ep.id) if feed.autodownload
    end
  end

  def short_episode_details
    out, status = Open3.capture2(youtube_dl_path, '--flat-playlist', '-j', '--', "#{feed.url}")
    raise IOError, 'Error downloading youtube playlist' if status.exitstatus != 0
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def feed
    Feed.find(feed_id)
  end
end
