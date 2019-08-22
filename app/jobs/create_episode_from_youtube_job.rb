require "youtube_episode_updater"

class CreateEpisodeFromYoutubeJob < ApplicationJob
  queue_as :default

  def perform(source_id, feed_id, url, description)
    feed = Feed.find(feed_id)
    return unless feed
    source = Source.find(source_id)
    updater = ::YoutubeEpisodeUpdater.new
    Episode.find_or_create_by(guid: url) do |ep|
      ep.build_fetch_status(status: 'NOT_ASKED')
      ep.assign_attributes(
        feed: feed,
        source: source,
        name: description,
        seen: false
      )
      begin
        updater.update(ep, url)
      rescue IOError
        break
      end
      unless ep.save
        Raven.capture_message("Could not save episode because: #{ep.errors.full_messages}")
        break
      end
      # TODO: If the new episode's source is preferred by the feed
      # download it and remove the other one
      if ep.should_download?
        DownloadThumbnailJob.perform_later(ep.id)
        ep.download! if ep.feed.autodownload
      end
    end
  end
end
