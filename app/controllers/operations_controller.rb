class OperationsController < ApplicationController
  include ActionView::Layouts

  def index
    render "index"
  end
end
