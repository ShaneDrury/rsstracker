require 'delayed_job'

class JobNotifyPlugin < Delayed::Plugin
  BROADCAST_BLACKLIST = %w[EpisodeUpdateBroadcastJob FeedUpdateBroadcastJob ActiveStorage::AnalyzeJob ActiveStorage::PurgeJob].freeze

  callbacks do |lifecycle|
    lifecycle.before(:invoke_job) do |job|
      job_class = job.payload_object.job_data["job_class"]
      next if BROADCAST_BLACKLIST.include?(job_class)
      ActionCable
        .server
        .broadcast(
          'feeds_channel',
          type: 'JOB_START',
          payload: {
            job: ActiveModelSerializers::SerializableResource.new(job).as_json
          }
        )
    end
    lifecycle.after(:invoke_job) do |job|
      ActionCable
        .server
        .broadcast(
          'feeds_channel',
          type: 'JOB_COMPLETE',
          payload: {
            jobId: job.id
          }
        )
    end
    lifecycle.after(:error) do |_, job|
      ActionCable
        .server
        .broadcast(
          'feeds_channel',
          type: 'JOB_ERROR',
          payload: {
            job: ActiveModelSerializers::SerializableResource.new(job).as_json
          }
        )
    end
  end
end
