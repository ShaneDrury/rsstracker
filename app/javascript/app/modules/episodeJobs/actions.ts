import { RemoteJob } from "../../types/job";

export enum episodeJobsActions {
  DOWNLOAD_EPISODE_STARTED = "DOWNLOAD_EPISODE_STARTED",
}

interface DownloadEpisodeStarted {
  type: episodeJobsActions.DOWNLOAD_EPISODE_STARTED;
  payload: {
    job: RemoteJob;
    episodeId: number;
  };
}

export const downloadEpisodeStarted = (
  job: RemoteJob,
  episodeId: number
): DownloadEpisodeStarted => ({
  type: episodeJobsActions.DOWNLOAD_EPISODE_STARTED,
  payload: { job, episodeId },
});

export type EpisodeJobsAction = DownloadEpisodeStarted;
