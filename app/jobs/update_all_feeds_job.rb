class UpdateAllFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Feed.update_all.flatten.uniq
  end
end
