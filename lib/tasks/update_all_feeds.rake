namespace :update do
  task feeds: :environment do
    UpdateFeedsJob.perform_later
  end
end
