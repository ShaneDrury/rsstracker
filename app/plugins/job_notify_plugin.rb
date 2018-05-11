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
    lifecycle.after(:perform) do |_, job|
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
  end
end
