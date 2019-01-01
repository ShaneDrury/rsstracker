namespace :update do
  task sources: :environment do
    Feed.all.each do |feed|
      source = Source.create(url: feed.url, source_type: feed.source)
      feed.update_attributes(sources: [source])
      feed.episodes.each do |episode|
        episode.update_attributes(source: source)
      end
    end
  end
end
