require 'fileutils'

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

    episode_filename = '%(id)s.%(ext)s'
    episode_folder = episode.feed.name.parameterize

    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, episode_folder, episode_filename)
      result = system "#{Rails.application.config.youtube_dl_path} -f 22 -o \"#{tmp_path}\" -x -- #{url}"
      result ||= system "#{Rails.application.config.youtube_dl_path} -f 18 -o \"#{tmp_path}\" -x -- #{url}"
      unless result
        episode.build_fetch_status(status: 'FAILURE').save
        raise "Failed!"
      end
      out = `#{Rails.application.config.youtube_dl_path} -j -- #{url}`
      json = JSON.parse(out)
      temp_file_path = File.join(temp_dir, episode_folder, "#{json['id']}.m4a")

      audio_attachment = episode.create_audio_attachment
      audio_attachment.audio = File.open(temp_file_path, binmode: true)
      audio_attachment.save

      filesize = 0
      description = json['description']
      duration = Time.at(json['duration']).utc.strftime('%H:%M:%S')
      publication_date = Date.strptime(json['upload_date'], '%Y%m%d')

      episode.update_attributes(
        description: description,
        duration: duration,
        publication_date: publication_date
      )
      episode.build_fetch_status(
        status: 'SUCCESS',
        url: "",
        bytes_total: filesize
      ).save
    end
    nil
  end
end
