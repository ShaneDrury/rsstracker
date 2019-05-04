require 'fileutils'

class CreateEpisodeFromYoutubeJob < ApplicationJob
  queue_as :default

  def perform(source_id, feed_id, url, description, youtube_dl_path)
    feed = Feed.find(feed_id)
    return unless feed
    source = Source.find(source_id)
    updater = ::YoutubeEpisodeUpdater.new(youtube_dl_path)
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
      # TODO: If the new episode's source is preferred by the feed
      # download it and remove the other one
      if ep.should_download?
        DownloadThumbnailJob.perform_later(ep.id)
        ep.download! if ep.feed.autodownload
      end
    end
  end
end
