namespace :update do
  task feeds: :environment do
    Feed.all.map(&:update)
  end
end
