# frozen_string_literal: true

class DownloadEpisodeJob < ApplicationJob
  queue_as :default

  BUFFER_SIZE = 8 * 1024

  def perform(episode_id)
    # business logic
    # unless episode already fetched
    # mark episode as loading
    # get audio file
    # for each tick, update bytes transferred
    # when finished
    # attach audio file to episode and persist
    episode = Episode.find(episode_id)
    return if episode.fetched?
    episode.set_as_loading!
    url = episode.url
    episode_filename = File.basename(FileDownloader.follow_redirect(url).path)

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
      FileDownloader.get(url, content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
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
