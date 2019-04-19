class FeedSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :description,
    :image_url,
    :autodownload,
    :source_type,
    :relative_image_link,
    :status_counts,
    :source_type

  has_many :all_sources
end
