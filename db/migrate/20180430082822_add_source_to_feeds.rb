class AddSourceToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :source, :text
  end
end
