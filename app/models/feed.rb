class Feed < ApplicationRecord
  has_many :episodes
  has_many :single_feed_sources
  # TODO: Rename this :single_feed_sources and let sources be the union of that and guessing
  # Are they polymorphic? Both have disabled field which would be useful to merge
  has_many :sources, through: :single_feed_sources, dependent: :destroy
  has_many :feed_guesses
  has_many :guessing_sources, through: :feed_guesses, dependent: :destroy, source: :source
  has_one_attached :thumbnail
  belongs_to :preferred_source, class_name: "Source"

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
    # TODO: Non disabled sources?
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

  def all_sources
    Source.for_feed(id).where(disabled: false)
  end

  def all_sources_with_disabled
    Source.for_feed(id)
  end

  def source_type
    source_types = Source.for_feed(id).distinct.pluck(:source_type)
    if source_types.length == 1
      source_types[0]
    elsif source_types.length > 1
      "mixed"
    end
  end
end
