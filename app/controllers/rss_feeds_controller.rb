class RssFeedsController < ApplicationController
  include ActionView::Layouts
  before_action :set_rss_feed, only: [:feed]

  def feed
    respond_to do |format|
      format.rss { render layout: false }
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_rss_feed
    @feed = Feed.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def feed_params
    params.fetch(:feed, {})
  end
end
