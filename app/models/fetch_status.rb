class FetchStatus < ApplicationRecord
  belongs_to :fetchable, polymorphic: true
end
