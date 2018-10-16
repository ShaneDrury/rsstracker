class AddSeenColumnToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :seen, :boolean, default: true
  end
end
