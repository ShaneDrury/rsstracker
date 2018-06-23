class AddThumbnailUrlToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :thumbnail_url, :text
  end
end
