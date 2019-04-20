class JobsController < ApplicationController
  before_action :set_job, only: [:destroy]

  def index
    @jobs = Delayed::Job.all
    respond_to do |format|
      format.json { render json: @jobs }
      format.html
    end
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
