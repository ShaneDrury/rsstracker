class YoutubePlaylist
  def initialize(url, source)
    @url = url
    @source = source
  end

  def episodes
    episodes = youtube.short_details(url).map do |short_details|
      RemoteYoutubeEpisode.new(short_details, source)
    end
    episodes.reject do |episode|
      episode.title == "[Deleted video]"
    end
  end

  private

  def youtube
    @youtube ||= Youtube.new
  end

  attr_accessor :url, :source
end
