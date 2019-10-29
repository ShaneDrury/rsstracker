class ApplicationJob < ActiveJob::Base
  def delayed_job
    Delayed::Job.find(provider_job_id)
  end
end
