import { RemoteJob } from "../../types/job";

export enum episodeJobsActions {
  DOWNLOAD_EPISODE_REQUESTED = "DOWNLOAD_EPISODE_REQUESTED",
  DOWNLOAD_EPISODE_STARTED = "DOWNLOAD_EPISODE_STARTED",
}

export interface DownloadEpisodeRequested {
  type: episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED;
  payload: {
    episodeId: string;
  };
}

interface DownloadEpisodeStarted {
  type: episodeJobsActions.DOWNLOAD_EPISODE_STARTED;
  payload: {
    job: RemoteJob;
    episodeId: string;
  };
}

export const downloadEpisodeRequested = (
  episodeId: string
): DownloadEpisodeRequested => ({
  type: episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED,
  payload: { episodeId },
});

export const downloadEpisodeStarted = (
  job: RemoteJob,
  episodeId: string
): DownloadEpisodeStarted => ({
  type: episodeJobsActions.DOWNLOAD_EPISODE_STARTED,
  payload: { job, episodeId },
});

export type EpisodeJobsAction =
  | DownloadEpisodeStarted
  | DownloadEpisodeRequested;
