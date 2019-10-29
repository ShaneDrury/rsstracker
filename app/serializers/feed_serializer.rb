class FeedSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :description,
    :image_url,
    :autodownload,
    :source_type,
    :source_type

  has_many :all_sources
end
