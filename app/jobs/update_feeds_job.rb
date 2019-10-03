class UpdateFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Feeds::GetEpisodes.all.run
  end
end
