class EpisodeSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :description,
    :duration,
    :guid,
    :url,
    :full_url,
    :publication_date,
    :seen

  has_one :feed
  has_one :fetch_status

  link(:small_thumbnail) { polymorphic_url(object.small_thumbnail, only_path: true) if object.thumbnail.attached? }
  link(:large_thumbnail) { polymorphic_url(object.thumbnail, only_path: true) if object.thumbnail.attached? }
  link(:audio_url) { object.audio_url }
end
