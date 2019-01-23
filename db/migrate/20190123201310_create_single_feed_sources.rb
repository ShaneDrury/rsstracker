class CreateSingleFeedSources < ActiveRecord::Migration[5.2]
  def change
    create_table :single_feed_sources do |t|
      t.references :feed, foreign_key: true
      t.references :source, foreign_key: true

      t.timestamps
    end
  end
end
