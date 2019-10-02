import { invert, mapValues, omit } from "lodash";
import { FeedJobsAction, feedJobsActions } from "./actions";
import { jobActions, JobsAction } from "../jobs/actions";

export interface State {
  items: {
    [key: string]: string;
  };
}

const initialState: State = { items: {} };
// TODO: the first argument to UpdateFeedJob is now a feed not a source
const sourceJobs = (
  state: State = initialState,
  action: FeedJobsAction | JobsAction
): State => {
  switch (action.type) {
    case feedJobsActions.UPDATE_FEEDS_STARTED: {
      const feedsToJobIds = mapValues(
        action.payload.feedsToJobs,
        job => job.id
      );
      return {
        ...state,
        items: {
          ...state.items,
          ...feedsToJobIds,
        },
      };
    }
    case jobActions.NEW_JOB: {
      const job = action.payload.job;
      if (job.jobClass === "UpdateFeedJob") {
        {
          return {
            ...state,
            items: {
              ...state.items,
              [job.arguments[0]]: job.id,
            },
          };
        }
      }
      return state;
    }
    case jobActions.FETCH_JOBS_COMPLETE: {
      const newJobs = action.payload.jobs.reduce<{ [key: string]: string }>(
        (acc, job) => {
          switch (job.jobClass) {
            case "UpdateFeedJob": {
              return {
                ...acc,
                [job.arguments[0]]: job.id,
              };
            }
            default:
              return acc;
          }
        },
        {}
      );
      return {
        ...state,
        items: {
          ...state.items,
          ...newJobs,
        },
      };
    }
    case jobActions.REMOVE_JOB_COMPLETE:
    case jobActions.JOB_COMPLETE: {
      const jobsByFeedId = invert(state.items);
      return {
        ...state,
        items: invert(omit(jobsByFeedId, [action.payload.jobId])),
      };
    }
    default:
      return state;
  }
};

export default sourceJobs;
