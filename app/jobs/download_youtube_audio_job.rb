class DownloadYoutubeAudioJob < ApplicationJob
  queue_as :default

  around_perform do |job, block|
    block.call
  rescue StandardError => e
    episode = Episode.find(job.arguments.first)
    episode.build_fetch_status(status: 'FAILURE').save
    raise e
  end

  def perform(episode_id)
    episode = Episode.find(episode_id)
    fetch_status = episode.fetch_status&.status
    return if fetch_status == "SUCCESS"
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    youtube = Youtube.new(Rails.application.config.youtube_dl_path)

    handle_download = lambda do |f, details|
      audio_attachment = episode.create_audio_attachment
      audio_attachment.audio = f
      audio_attachment.save

      episode.update_attributes(
        description: details['description'],
        duration: Time.at(details['duration']).utc.strftime('%H:%M:%S'),
        publication_date: Date.strptime(details['upload_date'], '%Y%m%d')
      )
      episode.build_fetch_status(
        status: 'SUCCESS',
        url: "",
        bytes_total: 0
      ).save
    end

    begin
      youtube.download_audio(url, quality: "22", &handle_download)
    rescue Youtube::DownloadError
      begin
        youtube.download_audio(url, quality: "18", &handle_download)
      rescue Youtube::DownloadError => e
        episode.build_fetch_status(status: 'FAILURE').save
        raise e
      end
    end
    nil
  end
end
