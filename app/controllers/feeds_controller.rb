class FeedsController < ApplicationController
  helper ReactHelper

  before_action :set_feed, only: [:show, :update, :destroy]

  # GET /feeds
  def index
    @feeds = Feed.all.order(name: :asc)
    respond_to do |format|
      format.html
      format.json { render json: @feeds }
    end
  end

  # GET /feeds/1
  def show
    respond_to do |format|
      format.json { render json: @feed }
      format.rss do
        @episodes = @feed.episodes.with_related.publication_order.for_status("SUCCESS")
        render layout: false
      end
      format.html
    end
  end

  # POST /feeds
  def create
    @feed = Feed.new(feed_params)

    if @feed.save
      respond_to do |format|
        format.json { render json: @feed, status: :created, location: @feed }
        format.html { redirect_to feed_url(@feed) }
      end
    else
      render json: @feed.errors, status: :unprocessable_entity
    end
  end

  def update_feeds
    job = UpdateFeedsJob.perform_later.delayed_job
    render json: job, status: :accepted
  end

  # PATCH/PUT /feeds/1
  def update
    if @feed.update(feed_params)
      respond_to do |format|
        format.json { render json: @feed }
        format.html
      end
    else
      respond_to do |format|
        format.json { render json: @feed.errors, status: :unprocessable_entity }
        format.html
      end
    end
  end

  # DELETE /feeds/1
  def destroy
    @feed.destroy
    respond_to do |format|
      format.html { redirect_to feeds_url }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_feed
    @feed = Feed.includes(thumbnail_attachment: :blob).find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def feed_params
    params.require(:feed).permit(:disabled, :autodownload, :name, :description, :preferred_source_id, :image_url)
  end
end
