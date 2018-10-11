namespace :update do
  task thumbnails: :environment do
    Episode.where.not(thumbnail_url: nil).each do |ep|
      new_thumb = ep.thumbnail_url.gsub("192.168.1.173", "192.168.1.94")
      ep.thumbnail_url = new_thumb
      ep.save
    end
  end
end
