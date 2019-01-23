class RemoveFeedFromSources < ActiveRecord::Migration[5.2]
  def change
    remove_column :sources, :feed_id
  end
end
