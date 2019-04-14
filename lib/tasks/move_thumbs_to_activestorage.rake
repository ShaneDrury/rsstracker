namespace :migrate do
  task thumbnails: :environment do
    Episode.where.not(thumbnail_url: nil).each do |ep|
      ep.thumbnail.attach(io: File.open(File.join(Rails.root, "public", ep.relative_image_link)), filename: ep.thumbnail_url, content_type: "image/jpeg")
    end

    Feed.where.not(image_url: nil).each do |feed|
      feed.thumbnail.attach(io: File.open(File.join(Rails.root, "public", feed.relative_image_link)), filename: feed.image_url, content_type: "image/jpeg")
    end
  end
end
