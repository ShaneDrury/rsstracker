class AudioAttachment < ApplicationRecord
  include AudioUploader[:audio]
  belongs_to :episode
end
