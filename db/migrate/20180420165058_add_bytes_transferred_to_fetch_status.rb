class AddBytesTransferredToFetchStatus < ActiveRecord::Migration[5.2]
  def change
    add_column :fetch_statuses, :bytes_transferred, :float
    add_column :fetch_statuses, :bytes_total, :float
  end
end
