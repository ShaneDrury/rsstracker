import { invert, mapValues, omit } from "lodash";
import { FeedJobsAction, feedJobsActions } from "../feedJobs/actions";
import { jobActions, JobsAction } from "../jobs/actions";

export interface State {
  items: {
    [key: string]: string;
  };
}

const initialState: State = { items: {} };

const sourceJobs = (
  state: State = initialState,
  action: FeedJobsAction | JobsAction
): State => {
  switch (action.type) {
    case feedJobsActions.UPDATE_FEEDS_STARTED: {
      const feedsToJobIds = mapValues(
        action.payload.sourcesToJobs,
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
      switch (job.jobClass) {
        case "DownloadFeedJob":
        case "DownloadYoutubePlaylistJob": {
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
            case "DownloadFeedJob":
            case "DownloadYoutubePlaylistJob": {
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
