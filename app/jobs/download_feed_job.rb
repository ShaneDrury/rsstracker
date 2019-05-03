require 'open-uri'
require 'rss'

class DownloadFeedJob < ApplicationJob
  class RssError < StandardError; end
  queue_as :default

  BUFFER_SIZE = 8 * 1024

  def perform(source_id)
    source = Source.find(source_id)
    feed = source.feed
    rss = RSS::Parser.parse(open(source.url).read, false)
    if rss.nil?
      raise RssError.new("RSS Feed was nil. Source id: #{source_id}")
    end
    if feed.image_url.empty?
      thumbnail_url = rss.channel.image.url
      thumbnail_filename = File.basename(URI(thumbnail_url).path)
      open(thumbnail_url, 'r') do |input|
        feed.thumbnail.attach(io: input, filename: thumbnail_filename, content_type: "image/jpeg")
      end
      feed.update_attributes(
        description: rss.channel.description,
      )
    end

    rss.items.each do |result|
      Episode.find_or_create_by(feed: feed, source: source, name: result.title, guid: result.guid.content) do |ep|
        ep.build_fetch_status(status: 'NOT_ASKED')
        ep.description = result.description
        ep.duration = result.itunes_duration.content
        ep.file_size = result.enclosure.length
        ep.publication_date = result.pubDate
        ep.url = result.link
        ep.seen = false
        ep.save
        feed.touch
        unless Episode.duplicates_for(ep).exists?
          DownloadEpisodeJob.perform_later(ep.id) if feed.autodownload
        end
      end
    end
    nil
  end
end
