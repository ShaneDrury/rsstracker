module ShrineBackgrounding
  class PromoteJob < ApplicationJob
    queue_as :default

    def perform(data)
      Shrine::Attacher.promote(data)
    end
  end
end
