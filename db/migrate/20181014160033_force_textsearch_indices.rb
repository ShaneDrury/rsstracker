class ForceTextsearchIndices < ActiveRecord::Migration[5.2]
  def change
    DbTextSearch::FullText.add_index connection, :episodes, :description
    DbTextSearch::FullText.add_index connection, :episodes, :name
  end
end
