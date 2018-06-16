class JobsController < ApplicationController
  def index
    @jobs = Delayed::Job.all
    jobs_with_extra = @jobs.map(&:with_extra)
    render json: jobs_with_extra
  end
end
