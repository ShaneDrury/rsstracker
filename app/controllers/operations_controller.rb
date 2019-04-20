class OperationsController < ApplicationController
  def index
    feeds = Feed.all.order(name: :asc)
    @feeds = ActiveModelSerializers::SerializableResource.new(feeds).as_json
    jobs = Delayed::Job.all
    @jobs = ActiveModelSerializers::SerializableResource.new(jobs).as_json
  end
end
