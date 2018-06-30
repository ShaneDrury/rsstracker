export enum episodeJobsActions {
  UPDATE_EPISODE_STARTED = "UPDATE_EPISODE_STARTED",
}

interface UpdateEpisodeStarted {
  type: episodeJobsActions.UPDATE_EPISODE_STARTED;
  payload: {
    jobId: string;
    episodeId: number;
  };
}

export const updateEpisodeStarted = (
  jobId: string,
  episodeId: number
): UpdateEpisodeStarted => ({
  type: episodeJobsActions.UPDATE_EPISODE_STARTED,
  payload: { jobId, episodeId },
});

export type EpisodeJobsAction = UpdateEpisodeStarted;
