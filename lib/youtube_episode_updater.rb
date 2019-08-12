require "youtube"

class YoutubeEpisodeUpdater
  def update(ep, url)
    details = full_details(url)
    ep.assign_attributes(
      description: details.description,
      duration: details.duration,
      publication_date: details.publication_date,
      source_thumbnail_url: details.thumbnail_url,
      url: url,
    )
  end

  private

  def full_details(url)
    ::Youtube.new.details(url)
  end
end
