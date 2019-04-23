class JobsController < ApplicationController
  before_action :set_job, only: [:destroy, :retry]

  def index
    @jobs = Delayed::Job.all
    respond_to do |format|
      format.json { render json: @jobs }
      format.html
    end
  end

  def retry
    @job.attempts = 0
    @job.run_at = Time.now
    @job.last_error = "Retry requested"
    @job.failed_at = nil
    @job.unlock
    @job.save!
    respond_to do |format|
      format.html { redirect_to jobs_url }
    end
  end

  def destroy
    @job.destroy
    respond_to do |format|
      format.json { head :no_content }
      format.html { redirect_to jobs_url }
    end
  end

  private

  def set_job
    @job = Delayed::Job.find(params[:id])
  end

  def job_params
    params.fetch(:job, {})
  end
end
