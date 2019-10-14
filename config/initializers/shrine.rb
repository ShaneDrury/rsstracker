require 'shrine'
require 'shrine/plugins/activerecord'
require 'shrine/plugins/backgrounding'
require 'shrine/plugins/data_uri'
require 'shrine/plugins/delete_promoted'
require 'shrine/plugins/delete_raw'
require 'shrine/storage/file_system'
require 'shrine/plugins/instrumentation'
require 'shrine/plugins/store_dimensions'
require 'shrine/plugins/restore_cached_data'
require 'shrine/plugins/pretty_location'

Shrine.plugin :activerecord
Shrine.plugin :backgrounding
Shrine.plugin :data_uri
Shrine.plugin :delete_promoted
Shrine.plugin :instrumentation
Shrine.plugin :restore_cached_data

def production_storages
  # Your probably want the directory to be in a shared location so its persisted between deployments
  {
    cache: Shrine::Storage::FileSystem.new('storage/shrine', prefix: 'cache'),
    store: Shrine::Storage::FileSystem.new(File.join(Rails.application.config.download_root, "shrine"), prefix: 'audio'),
  }
end

def development_storages
  {
    cache: Shrine::Storage::FileSystem.new('public/shrine', prefix: 'cache'),
    store: Shrine::Storage::FileSystem.new('public/shrine', prefix: 'audio'),
  }
end

Shrine.storages = Rails.env.production? ? production_storages : development_storages
