namespace :update do
  task all_feeds: :environment do
    UpdateFeedsJob.perform_later
  end
end
