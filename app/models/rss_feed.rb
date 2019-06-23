class RssFeed
  def self.from_url(url)
    RSS::Parser.parse(open(url).read, false)
  end
end
