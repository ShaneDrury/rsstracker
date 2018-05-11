import { RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { getJobs } from "./sources";

export enum jobActions {
  FETCH_JOBS_START = "FETCH_JOBS_START",
  FETCH_JOBS_COMPLETE = "FETCH_JOBS_COMPLETE",
  FETCH_JOBS_FAILURE = "FETCH_JOBS_FAILURE",
  REMOVE_JOBS = "REMOVE_JOBS",
}

interface FetchJobsStart {
  type: jobActions.FETCH_JOBS_START;
}

interface FetchJobsComplete {
  type: jobActions.FETCH_JOBS_COMPLETE;
  payload: {
    jobs: RemoteJob[];
  };
}

interface FetchJobsFailure {
  type: jobActions.FETCH_JOBS_FAILURE;
  payload: {
    error: string;
  };
}

interface RemoveJobs {
  type: jobActions.REMOVE_JOBS;
  payload: {
    jobIds: number[];
  };
}

export const fetchJobsStart = (): FetchJobsStart => ({
  type: jobActions.FETCH_JOBS_START,
});

export const fetchJobsComplete = (jobs: RemoteJob[]): FetchJobsComplete => ({
  type: jobActions.FETCH_JOBS_COMPLETE,
  payload: { jobs },
});

export const fetchJobsFailure = (error: string): FetchJobsFailure => ({
  type: jobActions.FETCH_JOBS_FAILURE,
  payload: { error },
});

export const removeJobs = (jobIds: number[]): RemoveJobs => ({
  type: jobActions.REMOVE_JOBS,
  payload: { jobIds },
});

export type JobsAction =
  | FetchJobsStart
  | FetchJobsComplete
  | FetchJobsFailure
  | RemoveJobs;

export const fetchJobs = (): RootThunk<void> => async dispatch => {
  dispatch(fetchJobsStart());
  try {
    const jobs = await getJobs();
    dispatch(fetchJobsComplete(jobs));
  } catch (err) {
    dispatch(fetchJobsFailure(err));
  }
};
