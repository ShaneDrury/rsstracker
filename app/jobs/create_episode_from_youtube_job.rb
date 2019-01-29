require 'fileutils'

class CreateEpisodeFromYoutubeJob < ApplicationJob
  queue_as :default

  def perform(source_id, episode, youtube_dl_path)
    source = Source.find(source_id)
    guesses = source.feed_guesses
    url = episode['url']
    description = episode['title']
    updater = ::YoutubeEpisodeUpdater.new(youtube_dl_path)
    feed = if source.feed.present?
             source.feed
           elsif guesses.present?
             guesses.detect { |guess| guess.matches_text?(description) }&.feed
           end
    return unless feed
    Episode.find_or_create_by(guid: url) do |ep|
      ep.build_fetch_status(status: 'NOT_ASKED')
      ep.feed = feed
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
        break
      end
      ep.feed.touch
      DownloadThumbnailJob.perform_later(ep.id)
      DownloadYoutubeAudioJob.perform_later(ep.id) if ep.feed.autodownload
    end
  end
end
