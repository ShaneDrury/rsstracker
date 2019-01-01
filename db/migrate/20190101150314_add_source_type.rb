class AddSourceType < ActiveRecord::Migration[5.2]
  def change
    add_column :sources, :type, :text, default: ""
  end
end
