require "youtube_episode_updater"

class YoutubePlaylistDownloader
  class EpisodeSaveFailure < StandardError; end

  def initialize(source_id, youtube_dl_path)
    @source_id = source_id
    @youtube_dl_path = youtube_dl_path
  end

  def download_playlist
    short_episode_details.each do |episode|
      update_or_create_episode(episode)
    end
    nil
  end

  private

  attr_reader :source_id, :youtube_dl_path

  def update_or_create_episode(episode)
    url = episode['url']
    description = episode['title']
    updater = ::YoutubeEpisodeUpdater.new(youtube_dl_path)
    Episode.find_or_create_by(guid: url) do |ep|
      ep.build_fetch_status(status: 'NOT_ASKED')
      if feed.present?
        ep.feed = feed
      elsif guesses.present?
        guesses.each do |guess|
          if guess.matches_text?(description)
            ep.feed = guess.feed
            break
          end
        end
      else
        raise StandardError, "Source didn't have a feed or guesses"
      end

      ep.source = source
      ep.name = description
      begin
        updater.update(ep, url)
      rescue IOError
        break
      end
      ep.seen = false
      unless ep.save
        Raven.capture_message("Could not save episode because: #{ep.errors.full_messages}")
      end
      ep.feed.touch
      DownloadThumbnailJob.perform_later(ep.id)
      DownloadYoutubeAudioJob.perform_later(ep.id) if feed.autodownload
    end
  end

  def short_episode_details
    out, status = Open3.capture2(youtube_dl_path, '--flat-playlist', '-j', '--', "#{source.url}")
    raise IOError, 'Error downloading youtube playlist' if status.exitstatus != 0
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def source
    Source.find(source_id)
  end

  def feed
    source.feed
  end

  def guesses
    source.feed_guesses
  end
end
