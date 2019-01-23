namespace :update do
  task single_feed_sources: :environment do
    Source.all.each do |source|
      SingleFeedSource.create(feed_id: source.feed_id, source: source)
    end
  end
end
