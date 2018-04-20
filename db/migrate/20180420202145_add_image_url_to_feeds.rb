class AddImageUrlToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :image_url, :text
  end
end
