class AddSourceToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_reference :episodes, :source, foreign_key: true
  end
end
