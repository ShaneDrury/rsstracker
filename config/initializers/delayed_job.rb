class Delayed::Job
  def with_extra
    yaml = YAML.load(handler)
    attributes.merge(job_data: yaml.job_data)
  end
end
