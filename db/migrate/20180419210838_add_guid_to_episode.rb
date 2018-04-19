class AddGuidToEpisode < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :guid, :text
  end
end
