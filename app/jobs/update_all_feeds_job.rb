class UpdateAllFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Feed.all.map(&:update_episodes)
  end
end
