class AddAutodownloadToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_column :feeds, :autodownload, :boolean, default: false
  end
end
