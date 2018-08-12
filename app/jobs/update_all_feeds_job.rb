class UpdateAllFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Feed.where(disabled: false).map(&:update_episodes)
  end
end
