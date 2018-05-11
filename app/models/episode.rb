class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy

  after_update_commit do
    EpisodeUpdateBroadcastJob.perform_later(id)
  end

  def as_json(options={})
    super(include: { fetch_status: { methods: :percentage_fetched } })
  end
end
