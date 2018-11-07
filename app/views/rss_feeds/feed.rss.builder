xml.instruct!
xml.rss :version => '2.0',
  'xmlns:atom' => 'http://www.w3.org/2005/Atom',
  'xmlns:itunes' => 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  'xmlns:media' => 'http://search.yahoo.com/mrss/' do
  xml.channel do
    xml.title @feed.name
    xml.description @feed.description
    xml.language 'en'
    xml.itunes :image, href: @feed.image_link(request)
    xml.link root_url
    xml.tag! 'atom:link', rel: 'self', type: 'application/rss+xml', href: feed_rss_feed_url(@feed.id, format: "rss")
    @feed.episodes.includes(:fetch_status).each do |episode|
      next unless episode.fetch_status&.status == 'SUCCESS'
      xml.item do
        if episode.name
          xml.title episode.name
        else
          xml.title ''
        end
        xml.description { xml.cdata! episode.description }
        xml.pubDate episode.publication_date.to_s(:rfc822)
        xml.itunes :duration, episode.duration
        if episode.relative_image_link
          xml.media :thumbnail, url: episode.image_link(request)
        elsif episode.thumbnail_url
          xml.media :thumbnail, url: episode.thumbnail_url
        end
        xml.media :content,
          url: episode.fetch_status.url,
          fileSize: episode.file_size.to_s,
          duration: episode.duration
        xml.guid({:isPermaLink => "false"}, episode.guid)
      end
    end
  end
end
