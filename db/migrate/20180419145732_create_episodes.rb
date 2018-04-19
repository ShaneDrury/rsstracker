class CreateEpisodes < ActiveRecord::Migration[5.2]
  def change
    create_table :episodes do |t|
      t.belongs_to :feed, foreign_key: true
      t.text :name

      t.timestamps
    end
  end
end
