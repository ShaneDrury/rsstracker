class AddUrlToFetchStatus < ActiveRecord::Migration[5.2]
  def change
    add_column :fetch_statuses, :url, :text
  end
end
