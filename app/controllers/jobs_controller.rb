class JobsController < ApplicationController
  before_action :set_job, only: [:destroy]

  def index
    @jobs = Delayed::Job.all
    jobs_with_extra = @jobs.map(&:with_extra)
    render json: jobs_with_extra
  end

  def destroy
    @job.destroy
    render json: { message: 'OK' }, status: 202
  end

  private

  def set_job
    @job = Delayed::Job.find(params[:id])
  end

  def job_params
    params.fetch(:job, {})
  end
end
