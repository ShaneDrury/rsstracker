class RemoteEpisode
  attr_accessor :source
  # TODO: Consider moving source private
  # and anything that uses it directly e.g. episode creation

  def initialize(source)
    @source = source
  end

  def feed
    @feed ||= source.matching_feed(title)
  end

  def create_episode!
    Episode.create_from_remote_episode!(self)
  end
end
