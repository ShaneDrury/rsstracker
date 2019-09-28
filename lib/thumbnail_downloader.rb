class ThumbnailDownloader
  def initialize(episode)
    @episode = episode
  end

  def download
    url = episode.source_thumbnail_url
    FileDownloader.get(url) do |input|
      episode.thumbnail.attach(io: input, filename: "thumbnail.jpg", content_type: "image/jpeg")
    end
    nil
  end

  private

  attr_reader :episode
end
