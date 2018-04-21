class AddPublicationDateToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :publication_date, :datetime
  end
end
