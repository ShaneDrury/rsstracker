class FetchStatus < ApplicationRecord
  belongs_to :fetchable, polymorphic: true, touch: true
end
