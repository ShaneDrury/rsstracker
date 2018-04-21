# frozen_string_literal: true

require 'open-uri'

BUFFER_SIZE = 8 * 1024

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    unless (ENV.include? 'STORAGE_ROOT') && (ENV.include? 'DOWNLOAD_ROOT')
      raise 'Must be run with STORAGE_ROOT and DOWNLOAD_ROOT env variables'
    end

    episode = Episode.find(episode_id)
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    episode_filename = File.basename(URI(url).path)
    episode_folder = episode.feed.name.parameterize
    download_path = File.join(episode_folder, episode_filename)
    abs_download_path = File.join(ENV['DOWNLOAD_ROOT'], download_path)
    FileUtils.mkdir_p File.join(ENV['DOWNLOAD_ROOT'], episode_folder)

    content_length_proc = lambda do |content_length|
      @bytes_total = content_length
    end

    @tick = 0

    progress_proc = lambda do |bytes_transferred|
      if @bytes_total
        @tick += 1
        if (@tick % 100).zero?
          episode.fetch_status.update_attributes(
            status: 'LOADING',
            bytes_transferred: bytes_transferred.to_d,
            bytes_total: @bytes_total.to_d,
          )
          @tick = 0
        end
      end
    end

    open(url, 'r', content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
      open(abs_download_path, 'wb') do |output|
        while (buffer = input.read(BUFFER_SIZE))
          output.write(buffer)
        end
      end
    end

    episode.build_fetch_status(
      status: 'SUCCESS',
      url: File.join(ENV['STORAGE_ROOT'], download_path),
      bytes_total: @bytes_total.to_d,
    ).save
  end
end
