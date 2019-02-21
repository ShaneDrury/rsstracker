class FetchStatusesController < ApplicationController
  before_action :set_fetch_status, only: [:show, :edit, :update, :destroy]

  # GET /fetch_statuses
  def index
    @fetch_statuses = FetchStatus.all
  end

  # GET /fetch_statuses/1
  def show
  end

  # GET /fetch_statuses/new
  def new
    @fetch_status = FetchStatus.new
  end

  # GET /fetch_statuses/1/edit
  def edit
  end

  # POST /fetch_statuses
  def create
    @fetch_status = FetchStatus.new(fetch_status_params)

    if @fetch_status.save
      redirect_to @fetch_status, notice: 'Fetch status was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /fetch_statuses/1
  def update
    if @fetch_status.update(fetch_status_params)
      redirect_to @fetch_status, notice: 'Fetch status was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /fetch_statuses/1
  def destroy
    @fetch_status.destroy
    redirect_to fetch_statuses_url, notice: 'Fetch status was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fetch_status
      @fetch_status = FetchStatus.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def fetch_status_params
      params.fetch(:fetch_status, {})
    end
end
