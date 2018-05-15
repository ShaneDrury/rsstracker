import { invert, omit } from "lodash";
import { jobActions, JobsAction } from "../jobs/actions";
import { FeedJobsAction, feedJobsActions } from "./actions";

export interface State {
  items: {
    [key: string]: string;
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
      const jobsByFeedId = invert(state.items);
      return {
        ...state,
        items: invert(omit(jobsByFeedId, action.payload.jobIds)),
      };
    }
    default:
      return state;
  }
};

export default feedJobs;
