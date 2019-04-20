class JobSerializer < ActiveModel::Serializer
  attributes :id,
    :last_error,
    :job_class,
    :job_id,
    :provider_job_id,
    :arguments

  def job_class
    object.payload_object.job_data["job_class"]
  end

  def job_id
    object.payload_object.job_data["job_id"]
  end

  def provider_job_id
    object.payload_object.job_data["provider_job_id"]
  end

  def arguments
    object.payload_object.job_data["arguments"]
  end
end
