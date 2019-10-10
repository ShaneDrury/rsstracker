class RemoteYoutubeEpisode < RemoteEpisode
  def self.from_short_details(title, url, source)
    new(
      title: title,
      guid: url,
      url: url,
      source: source,
    )
  end

  def id
    details.id
  end

  def duration
    details.duration
  end

  def publication_date
    details.publication_date
  end

  def thumbnail_url
    details.thumbnail_url
  end

  def description
    details.description
  end

  attr_accessor :file_size, :url, :title, :guid, :source

  private

  def details
    @details ||= Youtube.new.details(url)
  end
end
