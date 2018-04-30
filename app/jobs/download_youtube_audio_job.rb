class DownloadYoutubeAudioJob < ApplicationJob
  queue_as :default

  def perform(episode_id)
    unless (ENV.include? 'STORAGE_ROOT') && (ENV.include? 'DOWNLOAD_ROOT') && (ENV.include? 'YOUTUBE_DL_PATH')
      raise 'Must be run with STORAGE_ROOT, DOWNLOAD_ROOT and YOUTUBE_DL_PATH env variables'
    end

    episode = Episode.find(episode_id)
    fetch_status = episode.fetch_status&.status
    return if fetch_status == "SUCCESS"
    episode.build_fetch_status(status: 'LOADING').save
    url = episode.url

    episode_filename = '%(id)s.%(ext)s'
    episode_folder = episode.feed.name.parameterize
    download_path = File.join(episode_folder, episode_filename)
    abs_download_path = File.join(ENV['DOWNLOAD_ROOT'], download_path)
    FileUtils.mkdir_p File.join(ENV['DOWNLOAD_ROOT'], episode_folder)

    result = system "#{ENV['YOUTUBE_DL_PATH']} -f 22 -o \"#{abs_download_path}\" -x --audio-format m4a #{url}"

    if result
      out = `#{ENV['YOUTUBE_DL_PATH']} -j #{url}`
      json = JSON.parse(out)
      actual_download_path = File.join(episode_folder, "#{json['id']}.m4a")
      filesize = `gstat --printf="%s" "#{File.join(ENV['DOWNLOAD_ROOT'], actual_download_path)}"`
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
        url: File.join(ENV['STORAGE_ROOT'], actual_download_path),
        bytes_total: filesize
      ).save
    else
      episode.build_fetch_status(status: 'FAILURE').save
    end
    nil
  end
end