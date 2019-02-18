import { uniq } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { RemoteFeed, Source } from "../../types/feed";
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

export const episodeToJobDescription = (
  episodes: { [key: string]: RemoteEpisode },
  job: RemoteJob
): JobDescription => {
  const itemId = job.jobData.arguments[0];
  const errorMessage = job.lastError && job.lastError.split("\n")[0];
  const key = keyFromJob(job);
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
};

const feedsForSource = (feeds: RemoteFeed[], sourceId: number) =>
  uniq(
    feeds.filter(feed =>
      feed.sources.map(source => source.id).includes(sourceId)
    )
  );

export const feedToJobDescription = (
  feeds: { [key: string]: RemoteFeed },
  sources: { [key: string]: Source },
  job: RemoteJob
): JobDescription[] => {
  const sourceId = job.jobData.arguments[0];
  const sourceFeeds = feedsForSource(Object.values(feeds), sourceId);
  const notifications: JobDescription[] = [];
  sourceFeeds.forEach(feed => {
    const name = feed.name;
    const errorMessage = job.lastError && job.lastError.split("\n")[0];
    const error = errorMessage
      ? `${errorMessage} during Updating: ${name}`
      : undefined;
    notifications.push({
      id: job.id,
      key: keyFromJob(job),
      description: `Updating: ${name}`,
      error,
    });
  });
  return notifications;
};

export const thumbnailJobToDescription = (job: RemoteJob): JobDescription => {
  const errorMessage = job.lastError && job.lastError.split("\n")[0];
  const key = keyFromJob(job);
  const error = errorMessage && `${job.jobData.jobClass}: ${errorMessage}`;
  return {
    id: job.id,
    key,
    description: `Downloading thumbnail`,
    error,
  };
};
