require 'open-uri'

class ThumbnailDownloader
  def initialize(episode)
    @episode = episode
  end

  def download
    url = episode.source_thumbnail_url
    open(url, 'r') do |input|
      episode.thumbnail.attach(io: input, filename: "thumbnail.jpg", content_type: "image/jpeg")
    end
    nil
  end

  private

  attr_reader :episode
end
