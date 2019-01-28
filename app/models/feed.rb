class Feed < ApplicationRecord
  has_many :episodes
  has_many :single_feed_sources
  has_many :sources, through: :single_feed_sources, dependent: :destroy
  has_many :feed_guesses
  has_many :guessing_sources, through: :feed_guesses, dependent: :destroy, source: :source

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

  def self.all_unique_sources
    all.map(&:all_sources).flatten.uniq
  end

  def self.update_all
    all_unique_sources.map(&:update_episodes)
  end

  def update_episodes
    all_sources.map(&:update_episodes)
  end

  after_update_commit do
    FeedUpdateBroadcastJob.perform_later(id)
  end

  def as_json(*args)
    super(methods: [:relative_image_link, :status_counts, :sources])
  end

  def all_sources
    sources.where(disabled: false) | guessing_sources.where(disabled: false)
  end
end
