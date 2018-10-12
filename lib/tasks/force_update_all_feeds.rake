namespace :update do
  task all_feeds: :environment do
    Feed.all.map(&:update_episodes)
  end
end
