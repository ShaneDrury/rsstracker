namespace :update do
  task feeds: :environment do
    UpdateAllFeedsJob.perform_now
  end
end
