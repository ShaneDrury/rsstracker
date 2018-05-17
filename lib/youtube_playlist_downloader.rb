class YoutubePlaylistDownloader
  def initialize(feed_id, youtube_dl_path)
    @feed_id = feed_id
    @youtube_dl_path = youtube_dl_path
  end

  def download_playlist
    short_episode_details.each do |episode|
      update_or_create_episode(episode)
    end
    nil
  end

  private

  attr_reader :feed_id, :youtube_dl_path

  def update_or_create_episode(episode)
    description = episode['title']
    url = episode['url']
    Episode.find_or_create_by(feed: feed, name: description, guid: url) do |ep|
      YoutubeEpisodeUpdater.new(youtube_dl_path).update(ep, url)
      ep.save
      feed.touch
    end
  end

  def short_episode_details
    out = `#{youtube_dl_path} --flat-playlist -j -- #{feed.url}`
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def feed
    Feed.find(feed_id)
  end
end
