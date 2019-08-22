class FetchStatus < ApplicationRecord
  belongs_to :fetchable, polymorphic: true, touch: true
  include ActionView::Helpers::NumberHelper

  def percentage_fetched
    number_with_precision(bytes_transferred.to_d / bytes_total.to_d * 100.0, precision: 2) if status == 'LOADING' && bytes_transferred.present?
  end
end
