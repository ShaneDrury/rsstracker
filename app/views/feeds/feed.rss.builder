#encoding: UTF-8

xml.instruct! :xml, version: '1.0'
xml.rss version: '2.0' do
  xml.channel do
    xml.title @feed.name
    xml.description @feed.description
    xml.language 'en'
    for episode in @feed.episodes
      next unless episode.fetch_status.status == 'SUCCESS'
      xml.item do
        if episode.name
          xml.title episode.name
        else
          xml.title ''
        end
        xml.pubDate episode.updated_at.to_s(:rfc822)
        xml.link episode.download_link(request)
        xml.guid episode.guid
      end
    end
  end
end
