class RetryFailedEpsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    eps = Episode.joins(:fetch_status).where(fetch_statuses: { status: "FAILURE" })
    eps.map { |ep| DownloadEpisodeJob.perform_later(ep.id) }
  end
end
