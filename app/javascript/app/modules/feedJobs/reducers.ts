import { includes, omitBy } from "lodash";
import { jobActions, JobsAction } from "../jobs/actions";
import { FeedJobsAction, feedJobsActions } from "./actions";

export interface State {
  items: {
    [key: number]: number;
  };
}

const initialState: State = { items: {} };

const feedJobs = (
  state: State = initialState,
  action: FeedJobsAction | JobsAction
): State => {
  switch (action.type) {
    case feedJobsActions.UPDATE_FEED_START: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.feedId]: action.payload.jobId,
        },
      };
    }
    case jobActions.REMOVE_JOBS: {
      const jobs = omitBy(
        state.items,
        (feedId, jobId) => !includes(action.payload.jobIds, parseInt(jobId, 10))
      );
      return {
        ...state,
        items: jobs,
      };
    }
    default:
      return state;
  }
};

export default feedJobs;
