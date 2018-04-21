require 'open-uri'
require 'rss'

BUFFER_SIZE = 8 * 1024

class DownloadFeedJob < ApplicationJob
  queue_as :default

  def perform(feed_id)
    feed = Feed.find(feed_id)
    rss = RSS::Parser.parse(open(feed.url).read, false)

    thumbnail_url = rss.channel.image.url
    thumbnail_filename = File.basename(URI(thumbnail_url).path)
    feed_dir = Rails.root.join('public', 'uploads', feed_id.to_s)
    FileUtils.mkdir_p feed_dir
    download_path = feed_dir.join(thumbnail_filename)

    open(thumbnail_url, 'r') do |input|
      open(download_path, 'wb') do |output|
        while (buffer = input.read(BUFFER_SIZE))
          output.write(buffer)
        end
      end
    end
    feed.update_attributes(
      image_url: thumbnail_filename,
      description: rss.channel.description,
    )

    rss.items.each do |result|
      Episode.find_or_create_by(feed: feed, name: result.title, guid: result.guid.content) do |ep|
        ep.build_fetch_status(status: 'NOT_ASKED')
        ep.description = result.description
        ep.duration = result.itunes_duration.content
        ep.file_size = result.enclosure.length
        ep.publication_date = result.pubDate
        ep.url = result.link
        ep.save
      end
    end
    nil
  end
end
