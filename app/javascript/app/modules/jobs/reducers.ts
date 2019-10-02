import { difference, forEach, omit, union, values, zipObject } from "lodash";
import { RemoteJob } from "../../types/job";
import { EpisodeJobsAction, episodeJobsActions } from "../episodeJobs/actions";
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

const jobs = (
  state: JobsState = initialState,
  action: JobsAction | FeedJobsAction | EpisodeJobsAction
): JobsState => {
  switch (action.type) {
    case jobActions.FETCH_JOBS_REQUESTED: {
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    }
    case feedJobsActions.UPDATE_FEEDS_STARTED: {
      const feedJobs = values(action.payload.feedsToJobs);
      const jobIds = feedJobs.map(job => job.id);
      const jobIdsToJob = zipObject(jobIds, feedJobs);
      return {
        ...state,
        ids: union(state.ids, jobIds),
        fetchStatus: "SUCCESS",
        items: {
          ...state.items,
          ...jobIdsToJob,
        },
      };
    }
    case episodeJobsActions.DOWNLOAD_EPISODE_STARTED: {
      const job = action.payload.job;
      return {
        ...state,
        ids: union(state.ids, [job.id]),
        fetchStatus: "SUCCESS",
        items: {
          ...state.items,
          [job.id]: job,
        },
      };
    }
    case jobActions.NEW_JOB: {
      const job = action.payload.job;
      return {
        ...state,
        ids: union(state.ids, [job.id]),
        items: {
          ...state.items,
          [job.id]: job,
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
    case jobActions.REMOVE_JOB_COMPLETE:
    case jobActions.JOB_COMPLETE: {
      const newIds = difference(state.ids, [action.payload.jobId]);
      const newItems = omit(state.items, [action.payload.jobId]);
      return {
        ...state,
        ids: newIds,
        items: newItems,
      };
    }
    case jobActions.JOB_ERROR: {
      return {
        ...state,
        ids: union(state.ids, [action.payload.job.id]),
        items: {
          ...state.items,
          [action.payload.job.id]: action.payload.job,
        },
      };
    }
    default:
      return state;
  }
};

export default jobs;
