class AddNameToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :name, :text
  end
end
