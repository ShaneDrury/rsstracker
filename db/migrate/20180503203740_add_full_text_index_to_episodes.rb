class AddFullTextIndexToEpisodes < ActiveRecord::Migration[5.2]
  def change
    DbTextSearch::FullText.add_index connection, :episodes, :description
  end
end
