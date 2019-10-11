class UpdateSourceEpisodesJob < ApplicationJob
  queue_as :default

  def perform(source_id)
    source = Source.find(source_id)

    RemoteEpisodes.new(source).download_new
  end
end
