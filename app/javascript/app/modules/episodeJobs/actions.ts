export enum episodeJobsActions {
  UPDATE_EPISODE_START = "UPDATE_EPISODE_START",
}

interface UpdateEpisodeStart {
  type: episodeJobsActions.UPDATE_EPISODE_START;
  payload: {
    jobId: string;
    episodeId: number;
  };
}

export const updateEpisodeStart = (
  jobId: string,
  episodeId: number
): UpdateEpisodeStart => ({
  type: episodeJobsActions.UPDATE_EPISODE_START,
  payload: { jobId, episodeId },
});

export type EpisodeJobsAction = UpdateEpisodeStart;
