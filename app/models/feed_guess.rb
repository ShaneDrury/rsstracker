class FeedGuess < ApplicationRecord
  belongs_to :feed
  belongs_to :source

  def regex_pattern
    Regexp.new(pattern)
  end

  def matches_text?(text)
    regex_pattern.match?(text)
  end
end
