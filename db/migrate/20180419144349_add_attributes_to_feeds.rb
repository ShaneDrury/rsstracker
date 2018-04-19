class AddAttributesToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :url, :text
  end
end
