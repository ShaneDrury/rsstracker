class MarkLoadingEpsAsFailedJob < ApplicationJob
  queue_as :default

  def perform(*args)
    eps = Episode.joins(:fetch_status).where(fetch_statuses: { status: "LOADING" })
    eps.map { |ep| ep.build_fetch_status(status: "FAILURE").save }
  end
end
