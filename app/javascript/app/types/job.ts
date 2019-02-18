import { Omit } from "./util";

export type JobClass =
  | "DownloadFeedJob"
  | "DownloadYoutubePlaylistJob"
  | "DownloadEpisodeJob"
  | "DownloadYoutubeAudioJob"
  | "FetchOldThumbnailsJob"
  | "DownloadThumbnailJob";

export interface ProviderJob {
  id: number;
  lastError?: string;
  priority: number;
  jobData: {
    jobClass: JobClass;
    jobId: string;
    providerJobId: string;
    arguments: number[];
  };
}

export interface RemoteJob extends Omit<ProviderJob, "id"> {
  key: string;
  id: string;
}

export const isFeedJob = (job: RemoteJob) =>
  ["DownloadFeedJob", "DownloadYoutubePlaylistJob"].includes(
    job.jobData.jobClass
  );

export const isEpisodeJob = (job: RemoteJob) =>
  ["DownloadEpisodeJob", "DownloadYoutubeAudioJob"].includes(
    job.jobData.jobClass
  );

export const isThumbnailJob = (job: RemoteJob) =>
  ["DownloadThumbnailJob"].includes(job.jobData.jobClass);
