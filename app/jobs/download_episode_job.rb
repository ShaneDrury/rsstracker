# frozen_string_literal: true

require 'open-uri'

BUFFER_SIZE = 8 * 1024

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    episode = Episode.find(episode_id)
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    episode_filename = File.basename(URI(url).path)
    feed_dir = Rails.root.join('public', 'uploads', episode.feed_id.to_s)
    FileUtils.mkdir_p feed_dir

    download_path = feed_dir.join(episode_filename)

    content_length_proc = lambda do |content_length|
      @bytes_total = content_length
    end

    @tick = 0

    progress_proc = lambda do |bytes_transferred|
      if @bytes_total
        @tick += 1
        if (@tick % 100).zero?
          episode.build_fetch_status(
            status: 'LOADING',
            bytes_transferred: bytes_transferred.to_d,
            bytes_total: @bytes_total.to_d,
          ).save
          @tick = 0
        end
      end
    end

    open(url, 'r', content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
      open(download_path, 'wb') do |output|
        while (buffer = input.read(BUFFER_SIZE))
          output.write(buffer)
        end
      end
    end

    episode.build_fetch_status(status: 'SUCCESS', url: download_path).save
  end
end
