class EpisodesController < ApplicationController
  before_action :set_episode, only: [:show, :update, :destroy, :download, :stream]

  # GET /episodes
  def index
    @episodes = Episode.all

    render json: @episodes
  end

  # GET /episodes/1
  def show
    render json: @episode
  end

  def stream
    respond_to do |format|
      format.mp3 do
        response.headers['Content-Length'] = @episode.fetch_status.bytes_total.to_i
        send_file @episode.fetch_status.url, type: 'audio/mpeg', disposition: 'inline'
      end
    end
  end

  # POST /episodes/1/download
  def download
    job = DownloadEpisodeJob.perform_later(@episode.id)
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

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_episode
    @episode = Episode.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def episode_params
    params.require(:episode).permit(:feed_id, :name)
  end
end
