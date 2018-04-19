class AddUrlToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :url, :text
  end
end
