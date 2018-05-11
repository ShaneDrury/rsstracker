require 'job_notify_plugin'

Delayed::Worker.plugins << JobNotifyPlugin
