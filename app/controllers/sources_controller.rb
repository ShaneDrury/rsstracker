class SourcesController < ApplicationController
  before_action :set_source, only: [:show, :update, :destroy]

  # GET /sources
  def index
    @sources = Source.all
    respond_to do |format|
      format.html
      format.json { render json: @sources }
    end
  end

  # GET /sources/1
  def show
    respond_to do |format|
      format.json { render json: @source }
      format.html
    end
  end

  # POST /sources
  def create
    @source = Source.new(source_params) do |s|
      s.feed_id = params[:feed_id]
    end

    if @source.save
      respond_to do |format|
        format.json { render json: @source, status: :created, location: @source }
        format.html { redirect_back(fallback_location: root_path) }
      end
    else
      render json: @source.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sources/1
  def update
    if @source.update(source_params)
      respond_to do |format|
        format.json { render json: @source }
        format.html { redirect_back(fallback_location: root_path) }
      end
    else
      render json: @source.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sources/1
  def destroy
    @source.destroy
    respond_to do |format|
      format.json { head :no_content }
      format.html { redirect_back(fallback_location: root_path) }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_source
      @source = Source.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def source_params
      params.fetch(:source, {}).permit(:disabled, :feed_id, :source_type, :url)
    end
end
