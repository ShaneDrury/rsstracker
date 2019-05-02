module ShrineBackgrounding
  class DeleteJob < ApplicationJob
    queue_as :default

    def perform(data)
      Shrine::Attacher.delete(data)
    end
  end
end
