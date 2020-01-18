class RemoteYoutubeEpisode < RemoteEpisode
  def initialize(short_details, source)
    @short_details = short_details
    super(source)
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

  def title
    short_details.title
  end

  def file_size
    nil
  end

  def url
    short_details.url
  end

  def guid
    short_details.url
  end

  private

  attr_accessor :short_details

  def details
    @details ||= Youtube.new.details(url)
  end
end
