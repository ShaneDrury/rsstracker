import { RemoteEpisode } from "../../types/episode";
import { RemoteFeed } from "../../types/feed";
import { RemoteJob } from "../../types/job";

export interface JobDescription {
  id: string;
  description: string;
}

export const mapJobToDescription = (
  episodes: { [key: string]: RemoteEpisode },
  feeds: { [key: string]: RemoteFeed },
  job: RemoteJob
): JobDescription => {
  const itemId = job.jobData.arguments[0];
  switch (job.jobData.jobClass) {
    case "DownloadFeedJob":
    case "DownloadYoutubePlaylistJob": {
      const feed = feeds[itemId];
      if (!feed) {
        return {
          id: `${job.id}/notfetched`,
          description: `Updating: ${itemId}`,
        };
      }
      return {
        id: `${job.id}`,
        description: `Updating: ${feed.name}`,
      };
    }
    case "DownloadYoutubeAudioJob":
    case "DownloadEpisodeJob": {
      const episode = episodes[itemId];
      if (!episode) {
        return {
          id: `${job.id}/notfetched`,
          description: `Downloading ${itemId}`,
        };
      }
      return {
        id: `${job.id}`,
        description: `Downloading: ${episode.name}`,
      };
    }
  }
};
