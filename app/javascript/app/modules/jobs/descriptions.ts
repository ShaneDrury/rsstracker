import { RemoteEpisode } from "../../types/episode";
import { RemoteFeed } from "../../types/feed";
import { RemoteJob } from "../../types/job";

export interface JobDescription {
  id: string;
  key: string;
  description: string;
  error?: string;
}

export const mapJobToDescription = (
  episodes: { [key: string]: RemoteEpisode },
  feeds: { [key: string]: RemoteFeed },
  job: RemoteJob
): JobDescription => {
  const itemId = job.jobData.arguments[0];
  const errorMessage = job.lastError && job.lastError.split("\n")[0];
  switch (job.jobData.jobClass) {
    case "DownloadFeedJob":
    case "DownloadYoutubePlaylistJob": {
      const feed = feeds[itemId];
      const error = errorMessage
        ? feed
          ? `${errorMessage} during Updating: ${feed.name}`
          : `${errorMessage} during Updating: ${itemId}`
        : undefined;
      if (!feed) {
        return {
          id: job.id,
          key: `${job.id}-${job.lastError ? "error-" : ""}notfetched`,
          description: `Updating: ${itemId}`,
          error,
        };
      }
      return {
        id: job.id,
        key: `${job.id}${job.lastError ? "-error" : ""}`,
        description: `Updating: ${feed.name}`,
        error,
      };
    }
    case "DownloadYoutubeAudioJob":
    case "DownloadEpisodeJob": {
      const episode = episodes[itemId];
      const error = errorMessage
        ? episode
          ? `${errorMessage} during Updating: ${episode.name}`
          : `${errorMessage} during Updating: ${itemId}`
        : undefined;
      if (!episode) {
        return {
          id: job.id,
          key: `${job.id}-${job.lastError ? "error-" : ""}notfetched`,
          description: `Downloading ${itemId}`,
          error,
        };
      }
      return {
        id: job.id,
        key: `${job.id}${job.lastError ? "-error" : ""}`,
        description: `Downloading: ${episode.name}`,
        error,
      };
    }
    case "DownloadThumbnailJob":
    case "FetchOldThumbnailsJob": {
      return {
        id: job.id,
        key: job.id,
        description: `Downloading thumbnail`,
        error: errorMessage,
      };
    }
    default: {
      return {
        id: job.id,
        key: job.id,
        description: `${job.jobData.jobClass}`,
        error: errorMessage,
      };
    }
  }
};
