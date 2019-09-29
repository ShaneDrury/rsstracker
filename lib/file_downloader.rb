require "open-uri"

class FileDownloader
  def self.get(url)
    open(url, 'r') do |input|
      yield input
    end
  end

  def self.follow_redirect(url)
    open(url, redirect: false)
    URI(url)
  rescue OpenURI::HTTPRedirect => e
    URI(e.uri)
  end
end
