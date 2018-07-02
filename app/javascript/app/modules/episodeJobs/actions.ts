import { RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { downloadEpisode } from "../episodes/sources";
import { processJobResponse } from "../jobs/sources";

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

export const downloadEpisodeAction = (
  episodeId: number
): RootThunk<void> => async dispatch => {
  const downloadResponse = await downloadEpisode(episodeId);
  const job = processJobResponse(downloadResponse.job);
  dispatch(downloadEpisodeStarted(job, episodeId));
};

export type EpisodeJobsAction = DownloadEpisodeStarted;
