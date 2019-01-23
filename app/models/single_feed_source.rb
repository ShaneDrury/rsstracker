class SingleFeedSource < ApplicationRecord
  belongs_to :feed
  belongs_to :source
end
