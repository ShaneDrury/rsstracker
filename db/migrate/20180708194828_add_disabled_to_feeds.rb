class AddDisabledToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :disabled, :boolean, default: false
  end
end
