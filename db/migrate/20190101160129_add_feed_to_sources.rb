class AddFeedToSources < ActiveRecord::Migration[5.2]
  def change
    add_reference :sources, :feed, foreign_key: true
  end
end
