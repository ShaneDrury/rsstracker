ActiveRecord::Base.logger.level = 1

class Delayed::Job
  def with_extra
    attributes.merge(job_data: payload_object.job_data)
  end
end
