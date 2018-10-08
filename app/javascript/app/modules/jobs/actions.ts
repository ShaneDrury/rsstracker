import { RemoteJob } from "../../types/job";

export enum jobActions {
  FETCH_JOBS_REQUESTED = "FETCH_JOBS_REQUESTED",
  FETCH_JOBS_COMPLETE = "FETCH_JOBS_COMPLETE",
  FETCH_JOBS_FAILURE = "FETCH_JOBS_FAILURE",
  JOB_COMPLETE = "JOB_COMPLETE",
  JOB_ERROR = "JOB_ERROR",
  REMOVE_JOB_COMPLETE = "REMOVE_JOB_COMPLETE",
  NEW_JOB = "NEW_JOB",
  REMOVE_JOB_REQUESTED = "REMOVE_JOB_REQUESTED",
}

interface FetchJobsRequested {
  type: jobActions.FETCH_JOBS_REQUESTED;
}

export interface FetchJobsComplete {
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

export interface JobComplete {
  type: jobActions.JOB_COMPLETE;
  payload: {
    jobId: string;
  };
}

interface JobError {
  type: jobActions.JOB_ERROR;
  payload: {
    job: RemoteJob;
  };
}

export interface RemoveJobRequested {
  type: jobActions.REMOVE_JOB_REQUESTED;
  payload: {
    jobId: string;
  };
}

interface RemoveJobComplete {
  type: jobActions.REMOVE_JOB_COMPLETE;
  payload: {
    jobId: string;
  };
}

export interface NewJob {
  type: jobActions.NEW_JOB;
  payload: {
    job: RemoteJob;
  };
}

export const fetchJobsRequested = (): FetchJobsRequested => ({
  type: jobActions.FETCH_JOBS_REQUESTED,
});

export const fetchJobsComplete = (jobs: RemoteJob[]): FetchJobsComplete => ({
  type: jobActions.FETCH_JOBS_COMPLETE,
  payload: { jobs },
});

export const fetchJobsFailure = (error: string): FetchJobsFailure => ({
  type: jobActions.FETCH_JOBS_FAILURE,
  payload: { error },
});

export const jobComplete = (jobId: string): JobComplete => ({
  type: jobActions.JOB_COMPLETE,
  payload: { jobId },
});

export const jobError = (job: RemoteJob): JobError => ({
  type: jobActions.JOB_ERROR,
  payload: { job },
});

export const removeJobRequested = (jobId: string): RemoveJobRequested => ({
  type: jobActions.REMOVE_JOB_REQUESTED,
  payload: { jobId },
});

export const removeJobComplete = (jobId: string): RemoveJobComplete => ({
  type: jobActions.REMOVE_JOB_COMPLETE,
  payload: { jobId },
});

export const newJob = (job: RemoteJob): NewJob => ({
  type: jobActions.NEW_JOB,
  payload: { job },
});

export type JobsAction =
  | FetchJobsRequested
  | FetchJobsComplete
  | FetchJobsFailure
  | JobComplete
  | JobError
  | RemoveJobRequested
  | RemoveJobComplete
  | NewJob;
