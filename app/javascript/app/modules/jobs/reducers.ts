import { difference, forEach, omit, values, zipObject } from "lodash";
import { RemoteJob } from "../../types/job";
import { FeedJobsAction, feedJobsActions } from "../feedJobs/actions";
import { FetchStatus } from "../remoteData";
import { jobActions, JobsAction } from "./actions";

export interface JobsState {
  items: {
    [key: string]: RemoteJob;
  };
  fetchStatus: FetchStatus;
  ids: string[];
}

const initialState: JobsState = {
  items: {},
  fetchStatus: "NOT_ASKED",
  ids: [],
};

const episodes = (
  state: JobsState = initialState,
  action: JobsAction | FeedJobsAction
): JobsState => {
  switch (action.type) {
    case jobActions.FETCH_JOBS_START: {
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    }
    case feedJobsActions.UPDATE_FEED_STARTED: {
      return {
        ...state,
        ids: [...state.ids, action.payload.job.id],
        fetchStatus: "SUCCESS",
        items: {
          ...state.items,
          [action.payload.job.id]: action.payload.job,
        },
      };
    }
    case feedJobsActions.UPDATE_FEEDS_STARTED: {
      const jobs = values(action.payload.feedsToJobs);
      const jobIds = jobs.map(job => job.id);
      const jobIdsToJob = zipObject(jobIds, jobs);
      return {
        ...state,
        ids: [...state.ids, ...jobIds],
        fetchStatus: "SUCCESS",
        items: {
          ...state.items,
          ...jobIdsToJob,
        },
      };
    }
    case jobActions.FETCH_JOBS_COMPLETE: {
      const remoteJobs: { [key: string]: RemoteJob } = {};
      const ids: string[] = [...state.ids];
      forEach(action.payload.jobs, job => {
        remoteJobs[job.id] = job;
        ids.push(job.id);
      });
      return {
        ...state,
        ids,
        fetchStatus: "SUCCESS",
        items: {
          ...state.items,
          ...remoteJobs,
        },
      };
    }
    case jobActions.JOB_COMPLETE: {
      const newIds = difference(state.ids, [action.payload.jobId]);
      const newItems = omit(state.items, [action.payload.jobId]);
      return {
        ...state,
        ids: newIds,
        items: newItems,
      };
    }
    default:
      return state;
  }
};

export default episodes;
