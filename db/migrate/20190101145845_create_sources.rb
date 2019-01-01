class CreateSources < ActiveRecord::Migration[5.2]
  def change
    create_table :sources do |t|
      t.text :url
      t.boolean :disabled, default: false

      t.timestamps
    end
  end
end
