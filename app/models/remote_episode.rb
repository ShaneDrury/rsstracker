class RemoteEpisode
  # TODO: Probably no need for base class?
  def initialize(description: nil, duration: nil, file_size: nil, publication_date: nil, thumbnail_url: nil, url:, title:, guid:)
    @description = description
    @duration = duration
    @file_size = file_size
    @guid = guid
    @publication_date = publication_date
    @thumbnail_url = thumbnail_url
    @title = title
    @url = url
  end
end
