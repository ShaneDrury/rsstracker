class RemoteYoutubeEpisode < RemoteEpisode
  def self.from_short_details(title, url)
    new(
      description: title,
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

  attr_accessor :description, :file_size, :url

  private

  def details
    @details ||= Youtube.new.details(url)
  end
end
