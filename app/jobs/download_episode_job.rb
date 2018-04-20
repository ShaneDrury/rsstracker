require 'open-uri'

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    episode = Episode.find(episode_id)
    episode.build_fetch_status(status: 'LOADING')
    episode.save
    url = episode.url
    episode_filename = File.basename(URI(url).path)
    feed_dir = Rails.root.join('public', 'uploads', episode.feed_id.to_s)
    FileUtils.mkdir_p feed_dir
    download_path = feed_dir.join(episode_filename)
    open(download_path, 'wb') do |file|
      open(url) do |data|
        file.write(data.read)
      end
    end
    episode.build_fetch_status(status: 'SUCCESS', url: download_path)
    episode.save
  end
end
