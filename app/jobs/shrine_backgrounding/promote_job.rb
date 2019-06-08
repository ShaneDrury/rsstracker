module ShrineBackgrounding
  class PromoteJob < ApplicationJob
    queue_as :default

    def perform(data)
      Shrine::Attacher.promote(data)
      klass, record_id = data["record"]
      record = klass.constantize.find(record_id).episode
      record.touch
    end
  end
end
