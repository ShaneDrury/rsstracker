class UpdateAllFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Source.where(disabled: false).map(&:update_episodes)
  end
end
