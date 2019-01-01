namespace :update do
  task disabled: :environment do
    Source.all.each do |source|
      source.update_attributes(disabled: source.feed.disabled)
    end
  end
end
