class UpdateFeedsJob < ApplicationJob
  queue_as :default

  def perform
    Services::Feeds.all.update
  end
end
