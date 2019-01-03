class Feed < ApplicationRecord
  has_many :episodes
  has_many :sources

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
    sources.where(disabled: false).map(&:update_episodes)
  end

  after_update_commit do
    FeedUpdateBroadcastJob.perform_later(id)
  end

  def as_json(args)
    super(methods: [:relative_image_link, :status_counts, :sources])
  end
end
