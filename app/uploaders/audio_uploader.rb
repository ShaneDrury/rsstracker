class AudioUploader < Shrine
  plugin :backgrounding
  plugin :determine_mime_type
  plugin :pretty_location
  plugin :delete_promoted
  plugin :delete_raw
  plugin :logging
  plugin :recache

  Attacher.promote { |data| ShrineBackgrounding::PromoteJob.perform_later(data) }
  Attacher.delete { |data| ShrineBackgrounding::DeleteJob.perform_later(data) }
end
