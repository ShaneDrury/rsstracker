require "open-uri"

class FileDownloader
  def self.get(url, content_length_proc: nil, progress_proc: nil)
    open(url, 'r', content_length_proc: content_length_proc, progress_proc: progress_proc) do |input|
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
