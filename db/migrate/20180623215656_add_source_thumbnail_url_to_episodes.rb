class AddSourceThumbnailUrlToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :source_thumbnail_url, :text
  end
end
