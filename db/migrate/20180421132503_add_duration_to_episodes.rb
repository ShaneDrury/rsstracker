class AddDurationToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :duration, :string
  end
end
