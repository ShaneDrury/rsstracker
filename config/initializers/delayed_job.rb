ActiveRecord::Base.logger.level = 1

class Delayed::Job
  def with_extra
    attributes.merge(job_data: payload_object)
  end
end
