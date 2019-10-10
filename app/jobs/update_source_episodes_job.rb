class UpdateSourceEpisodesJob < ApplicationJob
  queue_as :default

  def perform(source_id, feed_ids)
    source = Source.find(source_id)
    feeds = Feed.where(id: feed_ids)

    RemoteEpisodes.new(source, feeds).download_new
  end
end
