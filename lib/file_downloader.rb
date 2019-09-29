require "open-uri"

class FileDownloader
  def self.get(url)
    open(url, 'r') do |input|
      yield input
    end
  end
end
