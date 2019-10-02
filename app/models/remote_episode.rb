class RemoteEpisode
  # TODO: Probably no need for base class?
  def initialize(description:, duration: nil, file_size: nil, publication_date: nil, thumbnail_url: nil, url:)
    @description = description
    @duration = duration
    @file_size = file_size
    @publication_date = publication_date
    @thumbnail_url = thumbnail_url
    @url = url
  end
end
