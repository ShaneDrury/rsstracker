class RemoteEpisode
  # TODO: Probably no need for base class?
  def initialize(description: nil, duration: nil, file_size: nil, publication_date: nil, thumbnail_url: nil, url:, title:, guid:, source:)
    @description = description
    @duration = duration
    @file_size = file_size
    @guid = guid
    @publication_date = publication_date
    @thumbnail_url = thumbnail_url
    @title = title
    @url = url
    @source = source
  end

  def feed
    @feed ||= source.matching_feed(title)
  end

  def create_episode!
    Episode.create_from_remote_episode!(self)
  end
end
