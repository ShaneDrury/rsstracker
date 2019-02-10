import { RemoteEpisode } from "../../types/episode";
import { Source } from "../../types/feed";
import { RemoteJob } from "../../types/job";

export interface JobDescription {
  id: string;
  key: string;
  description: string;
  error?: string;
}

const keyFromJob = (job: RemoteJob): string => {
  const parts = [job.id];
  if (job.lastError) {
    parts.push("error");
  }
  return parts.join("-");
};

export const mapJobToDescription = (
  episodes: { [key: string]: RemoteEpisode },
  sources: { [key: string]: Source },
  job: RemoteJob
): JobDescription => {
  const itemId = job.jobData.arguments[0];
  const errorMessage = job.lastError && job.lastError.split("\n")[0];
  const key = keyFromJob(job);
  switch (job.jobData.jobClass) {
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
          key: `${key}-notfetched`,
          description: `Downloading ${itemId}`,
          error,
        };
      }
      return {
        id: job.id,
        key,
        description: `Downloading: ${episode.name}`,
        error,
      };
    }
    case "DownloadThumbnailJob":
    case "FetchOldThumbnailsJob": {
      const error = errorMessage && `${job.jobData.jobClass}: ${errorMessage}`;
      return {
        id: job.id,
        key,
        description: `Downloading thumbnail`,
        error,
      };
    }
    default: {
      return {
        id: job.id,
        key,
        description: `${job.jobData.jobClass}`,
        error: errorMessage,
      };
    }
  }
};
