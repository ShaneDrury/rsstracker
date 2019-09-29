require 'rss'

class DownloadFeedJob < ApplicationJob
  class RssError < StandardError; end
  queue_as :default

  BUFFER_SIZE = 8 * 1024

  def perform(source_id)
    source = Source.find(source_id)
    feed = source.feed
    rss = RssFeed.from_url(source.url)
    if rss.nil?
      raise RssError.new("RSS Feed was nil. Source id: #{source_id}")
    end
    if feed.image_url.nil?
      thumbnail_url = rss.channel.image.url
      FileDownloader.get(thumbnail_url) do |input|
        feed.thumbnail.attach(io: input, filename: "thumbnail.jpg", content_type: "image/jpeg")
      end
      feed.update_attributes(
        description: rss.channel.description,
      )
    end

    rss.items.each do |rss_item|
      Episode.find_or_create_by(feed: feed, source: source, name: rss_item.title, guid: rss_item.guid.content) do |ep|
        description = if rss_item.description.strip.empty?
                        rss_item.itunes_summary
                      else
                        rss_item.description.strip
                      end
        ep.build_fetch_status(status: 'NOT_ASKED')
        ep.description = description
        ep.duration = rss_item.itunes_duration.content
        ep.file_size = rss_item.enclosure.length
        ep.publication_date = rss_item.pubDate
        ep.url = rss_item.link
        ep.seen = false
        ep.save
        feed.touch
        if ep.should_download?
          DownloadEpisodeJob.perform_later(ep.id) if feed.autodownload
        end
      end
    end
    nil
  end
end
