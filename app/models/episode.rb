class Episode < ApplicationRecord
  belongs_to :feed
  has_one :fetch_status, as: :fetchable, dependent: :destroy

  def download_link
    "http://localhost:3000/uploads/#{feed_id}/#{fetch_status.url}" if fetch_status.status == "SUCCESS"
  end

  def as_json(options={})
    super(include: { fetch_status: { methods: :percentage_fetched } }, methods: [:download_link])
  end
end
