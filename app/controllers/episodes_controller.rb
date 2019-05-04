class EpisodesController < ApplicationController
  helper ReactHelper
  before_action :set_episode, only: [:show, :update, :destroy, :download]

  # GET /episodes
  def index
    @episodes = Episode.includes(:fetch_status)
    @episodes = @episodes.where(id: params[:id]) if params[:id].present?
    @episodes = @episodes.where(feed_id: params[:feed_id]) if params[:feed_id].present?
    @episodes = @episodes.where(fetch_statuses: { status: params[:status] }) if params[:status].present?

    respond_to do |format|
      format.html
      format.json { render json: @episodes }
    end
  end

  def duplicates
    dup_names = Episode.unscoped.select(:name, "count(*)").group(:name).having("count(*) > 1").pluck(:name)
    @episodes = Episode.unscoped.where(name: dup_names).order(name: :asc, id: :asc )
    respond_to do |format|
      format.html
      format.json { render json: @episodes }
    end
  end

  # GET /episodes/1
  def show
    respond_to do |format|
      format.json { render json: @episode }
      format.html
    end
  end

  # POST /episodes/1/download
  def download
    active_job = @episode.download!
    job = Delayed::Job.find(active_job.provider_job_id)
    render json: job, status: :accepted
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
      respond_to do |format|
        format.json { render json: @episode }
        format.html
      end
    else
      respond_to do |format|
        format.json { render json: @episode.errors, status: :unprocessable_entity }
        format.html
      end
    end
  end

  # DELETE /episodes/1
  def destroy
    @episode.destroy
    respond_to do |format|
      format.json { head :no_content }
      format.html { redirect_back(fallback_location: episodes_url) }
    end
  end

  def search
    episodes = Episode.includes(:fetch_status, :feed)
    episodes = episodes.where(feed_id: params[:feed_id]) if params[:feed_id].present?
    episodes = if params[:search_term].present?
                 description = DbTextSearch::FullText.new(episodes, :description).search(params[:search_term])
                 name = DbTextSearch::FullText.new(episodes, :name).search(params[:search_term])
                 description.or(name)
               else
                 episodes
               end
    episodes = episodes.where(fetch_statuses: { status: params[:status] }) if params[:status].present?
    paged = episodes.page(params[:page_number] || 1).per(10)

    render json: paged, meta: pagination_dict(paged)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_episode
    @episode = Episode.includes(:fetch_status).find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def episode_params
    params.require(:episode).permit(:feed_id, :name, :status, :description, :publication_date, :id, :seen)
  end

  def pagination_dict(paged)
    {
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
end
