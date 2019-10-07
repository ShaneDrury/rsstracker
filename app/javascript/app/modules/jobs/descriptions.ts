import { uniq } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { RemoteFeed, Source } from "../../types/feed";
import { JobClass, RemoteJob } from "../../types/job";

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

interface ProcessedJob {
  id: string;
  itemId: number;
  errorMessage?: string;
  key: string;
  jobClass: JobClass;
}

export const processJob = (job: RemoteJob): ProcessedJob => ({
  id: job.id,
  itemId: job.arguments[0],
  errorMessage: job.lastError && job.lastError.split("\n")[0],
  key: keyFromJob(job),
  jobClass: job.jobClass,
});

// TODO: Maybe move id out of this, add it to notification later
// as its common to all

export const episodeToJobDescription = (
  episodes: { [key: string]: RemoteEpisode },
  { itemId, key, errorMessage, id }: ProcessedJob
): JobDescription => {
  const episode = episodes[itemId];
  const error = errorMessage
    ? episode
      ? `${errorMessage} during Updating: ${episode.name}`
      : `${errorMessage} during Updating: ${itemId}`
    : undefined;
  if (!episode) {
    return {
      id,
      key: `${key}-notfetched`,
      description: `Downloading ${itemId}`,
      error,
    };
  }
  return {
    id,
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
  sourceId: string
): JobDescription[] => {
  const notifications: JobDescription[] = [];
  const sourceFeeds = feedsForSource(
    Object.values(feeds),
    parseInt(sourceId, 10)
  );
  sourceFeeds.forEach(sourceFeed => {
    const name = sourceFeed.name;
    notifications.push({
      id: sourceId,
      key: sourceId,
      description: `Updating: ${name}`,
    });
  });
  return notifications;
};

export const thumbnailJobToDescription = ({
  key,
  errorMessage,
  id,
  jobClass,
}: ProcessedJob): JobDescription => {
  const error = errorMessage && `${jobClass}: ${errorMessage}`;
  return {
    id,
    key,
    description: "Downloading thumbnail",
    error,
  };
};
