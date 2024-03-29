xml.instruct!
xml.rss version: '2.0',
        'xmlns:atom' => 'http://www.w3.org/2005/Atom',
        'xmlns:itunes' => 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'xmlns:media' => 'http://search.yahoo.com/mrss/' do
  xml.channel do
    xml.title @feed.name
    xml.description @feed.description
    xml.language 'en'
    xml.itunes :image, href: polymorphic_url(@feed.thumbnail) if @feed.thumbnail.attached?
    xml.itunes :category, text: "Comedy"
    xml.itunes :explicit, "no"
    xml.itunes :owner do
      xml.itunes :name, "Me"
      xml.itunes :email, "foo@example.com"
    end
    xml.link root_url
    xml.tag! 'atom:link', rel: 'self', type: 'application/rss+xml', href: feed_url(@feed.id, format: "rss")
    @episodes.each do |episode|
      xml.item do
        if episode.name
          xml.title episode.name
        else
          xml.title ''
        end
        xml.description { xml.cdata! episode.description }
        xml.pubDate episode.publication_date.to_s(:rfc822)
        xml.itunes :duration, episode.duration
        xml.media :thumbnail, url: polymorphic_url(episode.thumbnail) if episode.thumbnail.attached?
        xml.media :content,
          url: episode.audio_url || episode.fetch_status.url,
          fileSize: episode.file_size.to_s,
          duration: episode.duration
        xml.guid({:isPermaLink => "false"}, episode.guid)
      end
    end
  end
end
