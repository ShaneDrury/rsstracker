require 'open-uri'

class ThumbnailDownloader
  def initialize(episode_id, download_root, storage_root)
    @episode_id = episode_id
    @download_root = download_root
    @storage_root = storage_root
  end

  def download
    url = episode.source_thumbnail_url
    thumbnail_extension = File.extname(URI(url).path)
    thumbnail_filename = episode.guid + thumbnail_extension
    episode_folder = episode.feed.name.parameterize
    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, episode_folder, thumbnail_filename)
      FileUtils.mkdir_p File.join(temp_dir, episode_folder)
      open(url, 'r') do |input|
        open(tmp_path, 'wb') do |output|
          output.write(input.read)
        end
      end
      FileUtils.mv(tmp_path, File.join(download_root, episode_folder, '/'))
    end
    episode.update_attributes(
      thumbnail_url: File.join(storage_root, episode_folder, thumbnail_filename)
    )
    nil
  end

  private

  attr_reader :episode_id, :download_root, :storage_root

  def episode
    Episode.find(episode_id)
  end
end
