class ConvertAudioDataToText < ActiveRecord::Migration[5.2]
  def change
    change_column :audio_attachments, :audio_data, :text
  end
end
