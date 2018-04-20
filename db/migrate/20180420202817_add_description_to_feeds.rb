class AddDescriptionToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :description, :text
  end
end
