import { difference, forEach, omit } from "lodash";
import { RemoteJob } from "../../types/job";
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
  action: JobsAction
): JobsState => {
  switch (action.type) {
    case jobActions.FETCH_JOBS_START: {
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    }
    case jobActions.FETCH_JOBS_COMPLETE: {
      const remoteJobs: { [key: string]: RemoteJob } = {};
      const ids: string[] = [];
      forEach(action.payload.jobs, job => {
        remoteJobs[job.providerJobId] = job;
        ids.push(job.providerJobId);
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
    case jobActions.REMOVE_JOBS: {
      const newIds = difference(state.ids, action.payload.jobIds);
      const newItems = omit(state.items, action.payload.jobIds);
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
