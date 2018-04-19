class CreateFetchStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :fetch_statuses do |t|
      t.text :error_reason
      t.text :status
      t.references :fetchable, polymorphic: true

      t.timestamps
    end
  end
end
