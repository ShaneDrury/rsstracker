class RemoteRssEpisode < RemoteEpisode
  def initialize(rss_item, source)
    @rss_item = rss_item
    super(source)
  end

  def description
    rss_description = rss_item.description.strip
    if rss_description.empty?
      rss_item.itunes_summary
    else
      rss_description
    end
  end

  def duration
    rss_item.itunes_duration.content
  end

  def file_size
    rss_item.enclosure.length
  end

  def publication_date
    rss_item.pubDate
  end

  def guid
    rss_item.guid.content
  end

  def title
    rss_item.title
  end

  def url
    rss_item.link
  end

  private

  attr_accessor :rss_item
end
