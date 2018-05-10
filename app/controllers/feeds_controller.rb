class FeedsController < ApplicationController
  before_action :set_feed, only: [:show, :update, :destroy, :update_feed]

  # GET /feeds
  def index
    @feeds = Feed.all.order(name: :asc)
    render json: @feeds
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
    job = @feed.update_episodes
    render json: { job_id: job.job_id }, status: :accepted
  end

  def update_feeds
    jobs = Feed.all.map(&:update_episodes)
    render json: { job_ids: jobs.map(&:job_id) }, status: :accepted
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
    params.fetch(:feed, {})
  end
end
