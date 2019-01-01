class Source < ApplicationRecord
  belongs_to :feed

  def update_episodes
    if source_type == 'rss'
      DownloadFeedJob.perform_later(id)
    elsif source_type == 'youtube'
      DownloadYoutubePlaylistJob.perform_later(id)
    else
      raise 'Unknown source type'
    end
  end
end
