class RemoveFeedIndexFromSources < ActiveRecord::Migration[5.2]
  def change
    remove_index :sources, :feed_id
  end
end
