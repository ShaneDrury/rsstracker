namespace :shrine do
  task clear_cache: :environment do
    file_system = Shrine.storages[:cache]
    file_system.clear!(older_than: Time.now - 24*60*60)
  end
end
