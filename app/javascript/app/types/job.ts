export type JobClass =
  | "DownloadFeedJob"
  | "DownloadYoutubePlaylistJob"
  | "DownloadEpisodeJob"
  | "DownloadYoutubeAudioJob"
  | "FetchOldThumbnailsJob"
  | "DownloadThumbnailJob";

export interface JobAttributes {
  lastError?: string;
  jobClass: JobClass;
  jobId: string;
  providerJobId: string;
  arguments: number[];
}

interface JobData {
  id: number;
  type: "delayedBackendActiveRecordJobs";
  attributes: JobAttributes;
}

export interface ProviderJob {
  data: JobData;
}

export interface ProviderJobs {
  data: ProviderJob[];
}

export interface RemoteJob extends JobAttributes {
  key: string;
  id: string;
}

export const isFeedJob = (job: RemoteJob) =>
  ["DownloadFeedJob", "DownloadYoutubePlaylistJob"].includes(job.jobClass);

export const isEpisodeJob = (job: RemoteJob) =>
  ["DownloadEpisodeJob", "DownloadYoutubeAudioJob"].includes(job.jobClass);

export const isThumbnailJob = (job: RemoteJob) =>
  ["DownloadThumbnailJob"].includes(job.jobClass);
