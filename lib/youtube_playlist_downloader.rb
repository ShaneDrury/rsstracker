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
      details = full_details(url)
      ep.build_fetch_status(status: 'NOT_ASKED')
      ep.description = details.description
      ep.duration = details.duration
      ep.publication_date = details.publication_date
      ep.url = url
      ep.save
      feed.touch
    end
  end

  def short_episode_details
    out = `#{youtube_dl_path} --flat-playlist -j -- #{feed.url}`
    out.split("\n").map { |line| JSON.parse(line) }
  end

  def full_details(url)
    YoutubeEpisodeDetails.new(url, youtube_dl_path).details
  end

  def feed
    Feed.find(feed_id)
  end
end
