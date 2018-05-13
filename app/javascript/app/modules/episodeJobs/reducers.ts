import { invert, omit } from "lodash";
import { jobActions, JobsAction } from "../jobs/actions";
import { EpisodeJobsAction, episodeJobsActions } from "./actions";

export interface State {
  items: {
    [key: string]: string;
  };
}

const initialState: State = { items: {} };

const episodeJobs = (
  state: State = initialState,
  action: EpisodeJobsAction | JobsAction
): State => {
  switch (action.type) {
    case episodeJobsActions.UPDATE_EPISODE_START: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.episodeId]: action.payload.jobId,
        },
      };
    }
    case jobActions.REMOVE_JOBS: {
      const jobsByEpisodeId = invert(state.items);
      return {
        ...state,
        items: omit(jobsByEpisodeId, action.payload.jobIds),
      };
    }
    default:
      return state;
  }
};

export default episodeJobs;
