export type JobClass =
  | "UpdateFeedJob"
  | "DownloadRemoteAudioJob"
  | "FetchOldThumbnailsJob"
  | "DownloadThumbnailJob";

export interface JobAttributes {
  lastError?: string;
  jobClass: JobClass;
  jobId: string;
  providerJobId: string;
  arguments: number[];
}

export interface JobData {
  id: number;
  type: "delayedBackendActiveRecordJobs";
  attributes: JobAttributes;
}

export interface ProviderJob {
  data: JobData;
}

export interface ProviderJobs {
  data: JobData[];
}

export interface RemoteJob extends JobAttributes {
  key: string;
  id: string;
}

export const isFeedJob = (job: RemoteJob) =>
  ["UpdateFeedJob"].includes(job.jobClass);

export const isEpisodeJob = (job: RemoteJob) =>
  ["DownloadRemoteAudioJob"].includes(job.jobClass);

export const isThumbnailJob = (job: RemoteJob) =>
  ["DownloadThumbnailJob"].includes(job.jobClass);
