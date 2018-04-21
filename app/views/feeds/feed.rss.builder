xml.instruct! :xml, version: '1.0'
xml.rss version: '2.0',
  'xmlns:itunes' => 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  'xmlns:media' => 'http://search.yahoo.com/mrss/' do
  xml.channel do
    xml.title @feed.name
    xml.description @feed.description
    xml.language 'en'
    xml.itunes :image, href: @feed.image_link(request)
    @feed.episodes.each do |episode|
      next unless episode.fetch_status.status == 'SUCCESS'
      xml.item do
        if episode.name
          xml.title episode.name
        else
          xml.title ''
        end
        xml.description { xml.cdata! episode.description }
        xml.pubDate episode.updated_at.to_s(:rfc822)
        xml.itunes :duration, Time.at(episode.duration).utc.strftime("%H:%M:%S")
        xml.media :content,
          url: stream_episode_url(episode, format: :mp3),
          fileSize: episode.file_size.to_s,
          duration: episode.duration.to_s
        xml.link stream_episode_url(episode, format: :mp3)
        xml.guid episode.guid
      end
    end
  end
end
