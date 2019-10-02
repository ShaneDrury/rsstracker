namespace :update do
  task feeds: :environment do
    Feed.pluck(:id).map do |feed_id|
      UpdateFeedJob.perform_later(feed_id)
    end
  end
end
