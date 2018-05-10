import { forEach } from "lodash";
import { RemoteJob } from "../../types/job";
import { FetchStatus } from "../remoteData";
import { jobActions, JobsAction } from "./actions";

export interface JobsState {
  items: {
    [key: string]: RemoteJob;
  };
  fetchStatus: FetchStatus;
  ids: number[];
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
      const ids: number[] = [];
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
    default:
      return state;
  }
};

export default episodes;
