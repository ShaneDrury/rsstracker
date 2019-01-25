require 'delayed_job'

ActiveRecord::Base.logger.level = 1

class Delayed::Job
  def with_extra
    attributes.merge(job_data: payload_object.job_data)
  end
end

class LogstashPlugin < Delayed::Plugin
  def self.logstash_logger
    @logger ||= create_logger
  end

  def self.create_logger
    return NullLogger.new unless Rails.configuration.logstash.try(:host)

    LogStashLogger.new(type: Rails.configuration.logstash.try(:type),
      host: Rails.configuration.logstash.try(:host),
      port: Rails.configuration.logstash.try(:port))
  end

  class NullLogger
    def info(*args)
    end
  end

  callbacks do |lifecycle|
    lifecycle.around(:invoke_job) do |job, *args, &block|
      start = Time.now
      block.call(job, *args)
      runtime = Time.now - start
      queued = start - job.created_at if job.created_at
      logstash_logger.info(
        event: 'delayed_job_completed',
        id: job.id,
        priority: job.priority,
        queue: job.queue,
        runtime: runtime,
        name: job.name,
        created_at: job.created_at,
        started_at: start,
        queued: queued)
    end
  end
end

Delayed::Worker.plugins << LogstashPlugin
