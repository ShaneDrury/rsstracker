class RemoteRssEpisode < RemoteEpisode
  # TODO: just use initialize
  def self.from_rss_episode(rss_item)
    rss_description = rss_item.description.strip
    description = if rss_description.empty?
                    rss_item.itunes_summary
                  else
                    rss_description
                  end
    new(
      description: description,
      duration: rss_item.itunes_duration.content,
      file_size: rss_item.enclosure.length,
      publication_date: rss_item.pubDate,
      guid: rss_item.guid.content,
      title: rss_item.title,
      url: rss_item.link,
    )
  end

  attr_accessor :description, :duration, :file_size, :publication_date, :thumbnail_url, :url, :guid
end
