export type JobClass =
  | "DownloadFeedJob"
  | "DownloadYoutubePlaylistJob"
  | "DownloadEpisodeJob"
  | "DownloadYoutubeAudioJob"
  | "FetchOldThumbnailsJob";

export interface ProviderJob {
  id: number;
  priority: number;
  jobData: {
    jobClass: JobClass;
    jobId: string;
    providerJobId: string;
    arguments: number[];
  };
}

export interface RemoteJob {
  key: string;
  id: string;
  priority: number;
  jobData: {
    jobClass: JobClass;
    jobId: string;
    providerJobId: string;
    arguments: number[];
  };
}
