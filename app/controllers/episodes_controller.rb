class EpisodesController < ApplicationController
  before_action :set_episode, only: [:show, :update, :destroy, :download]

  # GET /episodes
  def index
    @episodes = Episode
                .includes(:fetch_status)
                .where(feed_id: params[:feed_id])
    @episodes = @episodes.where(fetch_statuses: { status: params[:status] }) if params[:status].present?

    render json: @episodes
  end

  # GET /episodes/1
  def show
    render json: @episode
  end

  # POST /episodes/1/download
  def download
    source = @episode.feed.source
    job = if source == "rss"
            DownloadEpisodeJob.perform_later(@episode.id)
          elsif source == "youtube"
            DownloadYoutubeAudioJob.perform_later(@episode.id)
          else
            raise "Unknown source type"
          end
    render json: { job_id: job.job_id }, status: :accepted
  end

  # POST /episodes
  def create
    @episode = Episode.new(episode_params)

    if @episode.save
      render json: @episode, status: :created, location: @episode
    else
      render json: @episode.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /episodes/1
  def update
    if @episode.update(episode_params)
      render json: @episode
    else
      render json: @episode.errors, status: :unprocessable_entity
    end
  end

  # DELETE /episodes/1
  def destroy
    @episode.destroy
  end

  def search
    episodes = Episode.includes(:fetch_status).order(publication_date: :desc)
    episodes = episodes.where(feed_id: params[:feed_id]) if params[:feed_id].present?
    episodes = episodes.where(fetch_statuses: { status: params[:status] }) if params[:status].present?
    results = if params[:search_term].present?
                description = DbTextSearch::FullText.new(episodes, :description).search(params[:search_term])
                name = DbTextSearch::FullText.new(episodes, :name).search(params[:search_term])
                description.or(name)
              else
                episodes
              end
    paged = results.page(params[:page_number] || 1)
    render json: {
      items: paged,
      count: paged.count,
      current_page: paged.current_page,
      limit_value: paged.limit_value,
      total_pages: paged.total_pages,
      next_page: paged.next_page,
      prev_page: paged.prev_page,
      first_page: paged.first_page?,
      last_page: paged.last_page?,
      out_of_range: paged.out_of_range?,
    }
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_episode
    @episode = Episode.includes(:fetch_status).find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def episode_params
    params.require(:episode).permit(:feed_id, :name, :status)
  end
end
