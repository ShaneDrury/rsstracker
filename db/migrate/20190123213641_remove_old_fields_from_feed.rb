class RemoveOldFieldsFromFeed < ActiveRecord::Migration[5.2]
  def change
    remove_column :feeds, :url, :text
    remove_column :feeds, :source, :text
    remove_column :feeds, :disabled, :boolean
  end
end
