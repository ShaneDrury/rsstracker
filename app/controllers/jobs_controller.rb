class JobsController < ApplicationController
  def index
    @jobs = Delayed::Job.all
    render json: @jobs
  end
end
