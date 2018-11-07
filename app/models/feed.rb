class Feed < ApplicationRecord
  has_many :episodes

  def image_link(request)
    "#{request.protocol}#{request.host}:#{request.port}#{relative_image_link}"
  end

  def relative_image_link
    "/uploads/#{id}/#{image_url}"
  end

  def status_counts
    counts = FetchStatus.where(fetchable: episodes).group(:status).count
    counts['all'] = counts.values.sum
    counts
  end

  def update_episodes
    if source == 'rss'
      DownloadFeedJob.perform_later(id)
    elsif source == 'youtube'
      DownloadYoutubePlaylistJob.perform_later(id)
    else
      raise 'Unknown source type'
    end
  end

  after_update_commit do
    FeedUpdateBroadcastJob.perform_later(id)
  end

  def as_json(args)
    super(methods: [:relative_image_link, :status_counts])
  end
end
