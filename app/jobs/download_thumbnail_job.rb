class DownloadThumbnailJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    unless (ENV.include? 'STORAGE_ROOT') && (ENV.include? 'DOWNLOAD_ROOT')
      raise 'Must be run with STORAGE_ROOT and DOWNLOAD_ROOT env variables'
    end
    downloader = ThumbnailDownloader.new(episode_id, ENV['DOWNLOAD_ROOT'], ENV['STORAGE_ROOT'])
    downloader.download
  end
end
