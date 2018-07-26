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
