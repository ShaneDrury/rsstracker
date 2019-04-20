class EpisodeSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :description,
    :guid,
    :url,
    :full_url,
    :publication_date,
    :seen,
    :small_thumbnail,
    :large_thumbnail

  has_one :feed
  has_one :fetch_status

  def small_thumbnail
    url_for(object.small_thumbnail) if object.thumbnail.attached?
  end

  def large_thumbnail
    url_for(object.thumbnail) if object.thumbnail.attached?
  end
end
