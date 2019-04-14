require 'open-uri'

class ThumbnailDownloader
  def initialize(episode_id)
    @episode_id = episode_id
  end

  def download
    url = episode.source_thumbnail_url
    thumbnail_extension = File.extname(URI(url).path)
    thumbnail_filename = episode.guid + thumbnail_extension
    episode_folder = episode.feed.name.parameterize
    Dir.mktmpdir do |temp_dir|
      FileUtils.mkdir_p File.join(temp_dir, episode_folder)
      open(url, 'r') do |input|
        episode.thumbnail.attach(io: input, filename: thumbnail_filename, content_type: "image/jpeg")
      end
    end
    nil
  end

  private

  attr_reader :episode_id

  def episode
    Episode.find(episode_id)
  end
end
