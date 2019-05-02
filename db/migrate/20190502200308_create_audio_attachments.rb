class CreateAudioAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :audio_attachments do |t|
      t.string :audio_data
      t.references :episode, foreign_key: true

      t.timestamps
    end
  end
end
