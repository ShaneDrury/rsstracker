class AddNameToSources < ActiveRecord::Migration[5.2]
  def change
    add_column :sources, :name, :text
  end
end
