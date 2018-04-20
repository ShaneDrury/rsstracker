class Feed < ApplicationRecord
  has_many :episodes

  def image_link(request)
    "#{request.host}:#{request.port}/uploads/#{id}/#{image_url}"
  end
end
