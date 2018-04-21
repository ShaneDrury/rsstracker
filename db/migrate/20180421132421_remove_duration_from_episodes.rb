class RemoveDurationFromEpisodes < ActiveRecord::Migration[5.2]
  def change
    remove_column :episodes, :duration, :int
  end
end
