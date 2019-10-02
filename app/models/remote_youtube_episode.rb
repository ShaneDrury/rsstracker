class RemoteYoutubeEpisode < RemoteEpisode
  def self.from_short_details(title, url)
    new(
      title: title,
      guid: url,
      url: url,
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

  attr_accessor :file_size, :url, :title

  private

  def details
    @details ||= Youtube.new.details(url)
  end
end
