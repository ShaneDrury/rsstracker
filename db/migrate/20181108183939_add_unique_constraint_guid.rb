class AddUniqueConstraintGuid < ActiveRecord::Migration[5.2]
  def change
    add_index :episodes, :guid, unique: true
  end
end
