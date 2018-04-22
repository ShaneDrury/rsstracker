class Feed < ApplicationRecord
  has_many :episodes

  def image_link(request)
    "#{request.host}:#{request.port}/uploads/#{id}/#{image_url}"
  end

  def relative_image_link
    "/uploads/#{id}/#{image_url}"
  end

  def as_json(args)
    super(methods: [:relative_image_link])
  end
end
