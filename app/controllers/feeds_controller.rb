class FeedsController < ApplicationController
  before_action :set_feed, only: [:show, :update, :destroy, :update_feed]

  # GET /feeds
  def index
    @feeds = Feed.all.order(name: :asc)
    counts = FetchStatus.group(:status).count
    counts['all'] = counts.values.sum
    render json: { items: @feeds, status_counts: counts }
  end

  # GET /feeds/1
  def show
    render json: @feed
  end

  # POST /feeds
  def create
    @feed = Feed.new(feed_params)

    if @feed.save
      render json: @feed, status: :created, location: @feed
    else
      render json: @feed.errors, status: :unprocessable_entity
    end
  end

  def update_feed
    active_job = @feed.update_episodes
    job = Delayed::Job.find(active_job.provider_job_id)
    render json: { job: job.with_extra }, status: :accepted
  end

  def update_feeds
    active_jobs = Feed.find(params[:feed_ids]).map(&:update_episodes)
    jobs = Delayed::Job.find(active_jobs.map(&:provider_job_id))
    jobs_with_extra = jobs.map(&:with_extra)
    render json: { jobs: jobs_with_extra }, status: :accepted
  end

  # PATCH/PUT /feeds/1
  def update
    if @feed.update(feed_params)
      render json: @feed
    else
      render json: @feed.errors, status: :unprocessable_entity
    end
  end

  # DELETE /feeds/1
  def destroy
    @feed.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_feed
    @feed = Feed.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def feed_params
    params.require(:feed).permit(:disabled, :autodownload)
  end
end
