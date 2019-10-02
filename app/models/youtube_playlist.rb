class YoutubePlaylist
  def initialize(url)
    @url = url
  end

  def episodes
    episodes = youtube.short_details(url).map do |item|
      RemoteYoutubeEpisode.from_short_details(item.title, item.url)
    end
    episodes.reject do |episode|
      episode.title == "[Deleted video]"
    end
  end

  private

  def youtube
    @youtube ||= Youtube.new
  end

  attr_accessor :url
end
