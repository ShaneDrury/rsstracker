namespace :update do
  task all_thumbnails: :environment do
    Episode.where.not(thumbnail_url: nil).each do |ep|
      DownloadThumbnailJob.perform_later(ep.id)
    end
  end
end
