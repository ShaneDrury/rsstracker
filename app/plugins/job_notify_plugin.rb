require 'delayed_job'

class JobNotifyPlugin < Delayed::Plugin
  callbacks do |lifecycle|
    lifecycle.before(:invoke_job) do |job|
      ActionCable
        .server
        .broadcast(
          'feeds_channel',
          type: 'JOB_START',
          payload: {
            job_id: job.id
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
            job_id: job.id
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
            job: job.with_extra
          }
        )
    end
  end
end
