class AddSizesToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :duration, :int
    add_column :episodes, :file_size, :int
  end
end
