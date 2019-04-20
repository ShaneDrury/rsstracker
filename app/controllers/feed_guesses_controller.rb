class FeedGuessesController < ApplicationController
  before_action :set_feed_guess, only: [:show, :update, :destroy, :update_feed_guess]

  # GET /feed_guesses
  def index
    @feed_guesss = FeedGuess.all.order(name: :asc)
    respond_to do |format|
      format.html
      format.json { render json: @feed_guesses }
    end
  end

  # GET /feed_guesses/1
  def show
    respond_to do |format|
      format.json { render json: @feed_guess }
      format.rss { render layout: false }
      format.html
    end
  end

  # POST /feed_guesses
  def create
    @feed_guess = FeedGuess.new(feed_guess_params) do |fg|
      fg.source_id = params[:source_id]
    end

    if @feed_guess.save
      respond_to do |format|
        format.json { render json: @feed_guess, status: :created, location: @feed_guess }
        format.html { redirect_back(fallback_location: root_path) }
      end
    else
      render json: @feed_guess.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /feed_guesses/1
  def update
    if @feed_guess.update(feed_guess_params)
      respond_to do |format|
        format.json { render json: @feed_guess }
        format.html
      end
    else
      respond_to do |format|
        format.json { render json: @feed_guess.errors, status: :unprocessable_entity }
        format.html
      end
    end
  end

  # DELETE /feed_guesses/1
  def destroy
    @feed_guess.destroy
    respond_to do |format|
      format.html { redirect_back(fallback_location: root_path) }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_feed_guess
    @feed_guess = FeedGuess.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def feed_guess_params
    params.require(:feed_guess).permit(:feed_id, :source_id, :pattern)
  end
end
