namespace :update do
  task all_feeds: :environment do
    Feed.pluck(:id).map do |feed_id|
      UpdateFeedJob.perform_later(feed_id)
    end
  end
end
