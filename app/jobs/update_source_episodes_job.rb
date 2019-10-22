class UpdateSourceEpisodesJob < ApplicationJob
  queue_as :default

  def perform(source_id)
    Source.find(source_id).download_new
  end
end
