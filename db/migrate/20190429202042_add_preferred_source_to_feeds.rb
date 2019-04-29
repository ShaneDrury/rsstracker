class AddPreferredSourceToFeeds < ActiveRecord::Migration[5.2]
  def change
    add_reference :feeds, :preferred_source, foreign_key: { to_table: :sources }
  end
end
