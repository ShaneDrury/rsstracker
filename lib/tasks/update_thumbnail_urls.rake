namespace :update do
  task thumbnails: :environment do
    Episode.where.not(thumbnail_url: nil).each do |ep|
      new_thumb = ep.thumbnail_url.gsub("http://192.168.1.94:9000", "https://ubuntu.home:445")
      ep.thumbnail_url = new_thumb
      ep.save
    end
  end
end
