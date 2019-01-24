class CreateFeedGuesses < ActiveRecord::Migration[5.2]
  def change
    create_table :feed_guesses do |t|
      t.references :feed, foreign_key: true
      t.references :source, foreign_key: true
      t.text :pattern

      t.timestamps
    end
  end
end
