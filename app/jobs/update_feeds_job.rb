class UpdateFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Feed.all.update_episodes
  end
end
