# frozen_string_literal: true

require 'open-uri'



class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  BUFFER_SIZE = 8 * 1024

  def perform(episode_id)
    storage_root = Rails.application.config.storage_root
    download_root = Rails.application.config.download_root
    unless storage_root.present? && download_root.present?
      raise 'Must be run with :storage_root and :download_root settings'
    end

    episode = Episode.find(episode_id)
    fetch_status = episode.fetch_status&.status
    return if fetch_status == "SUCCESS"
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    episode_filename = File.basename(URI(url).path)
    episode_folder = episode.feed.name.parameterize
    download_path = File.join(episode_folder, episode_filename)
    abs_download_path = File.join(download_root, download_path)
    FileUtils.mkdir_p File.join(download_root, episode_folder)

    content_length_proc = lambda do |content_length|
      @bytes_total = content_length
    end

    @tick = 0

    progress_proc = lambda do |bytes_transferred|
      if @bytes_total
        @tick += 1
        if (@tick % 500).zero?
          episode.fetch_status.update_attributes(
            status: 'LOADING',
            bytes_transferred: bytes_transferred.to_d,
            bytes_total: @bytes_total.to_d,
          )
          @tick = 0
        end
      end
    end

    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, episode_folder, episode_filename)
      FileUtils.mkdir_p File.join(temp_dir, episode_folder)
      pp tmp_path
      pp File.join(download_root, episode_folder, '/')
      open(url, 'r', content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
        open(tmp_path, 'wb') do |output|
          while (buffer = input.read(BUFFER_SIZE))
            output.write(buffer)
          end
        end
      end

      FileUtils.mv(tmp_path, File.join(download_root, episode_folder, '/'))
    end

    episode.build_fetch_status(
      status: 'SUCCESS',
      url: File.join(storage_root, download_path),
      bytes_total: @bytes_total.to_d,
    ).save
  end
end
