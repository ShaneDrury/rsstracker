# frozen_string_literal: true

require 'open-uri'

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  BUFFER_SIZE = 8 * 1024

  def perform(episode_id)
    episode = Episode.find(episode_id)
    fetch_status = episode.fetch_status&.status
    return if fetch_status == "SUCCESS"
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    begin
      open(url, redirect: false)
      episode_filename = File.basename(URI(url).path)
    rescue OpenURI::HTTPRedirect => e
      episode_filename = File.basename(URI(e.uri).path)
    end

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
      tmp_path = File.join(temp_dir, episode_filename)
      open(url, 'r', content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
        open(tmp_path, 'wb') do |output|
          while (buffer = input.read(BUFFER_SIZE))
            output.write(buffer)
          end
        end
      end

      audio_attachment = episode.create_audio_attachment
      audio_attachment.audio = File.open(tmp_path, binmode: true)
      audio_attachment.save
    end

    episode.build_fetch_status(
      status: 'SUCCESS',
      url: "",
      bytes_total: @bytes_total.to_d,
    ).save
  end
end
