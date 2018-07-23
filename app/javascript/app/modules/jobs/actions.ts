import { RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { deleteJob, getJobs } from "./sources";

export enum jobActions {
  FETCH_JOBS_START = "FETCH_JOBS_START",
  FETCH_JOBS_COMPLETE = "FETCH_JOBS_COMPLETE",
  FETCH_JOBS_FAILURE = "FETCH_JOBS_FAILURE",
  JOB_COMPLETE = "JOB_COMPLETE",
  JOB_ERROR = "JOB_ERROR",
  REMOVE_JOB_COMPLETE = "REMOVE_JOB_COMPLETE",
  NEW_JOB = "NEW_JOB",
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

interface JobComplete {
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

interface RemoveJobComplete {
  type: jobActions.REMOVE_JOB_COMPLETE;
  payload: {
    jobId: string;
  };
}

interface NewJob {
  type: jobActions.NEW_JOB;
  payload: {
    job: RemoteJob;
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

export const jobComplete = (jobId: string): JobComplete => ({
  type: jobActions.JOB_COMPLETE,
  payload: { jobId },
});

export const jobError = (job: RemoteJob): JobError => ({
  type: jobActions.JOB_ERROR,
  payload: { job },
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
  | FetchJobsStart
  | FetchJobsComplete
  | FetchJobsFailure
  | JobComplete
  | JobError
  | RemoveJobComplete
  | NewJob;

export const fetchJobs = (): RootThunk<void> => async dispatch => {
  dispatch(fetchJobsStart());
  try {
    const jobs = await getJobs();
    dispatch(fetchJobsComplete(jobs));
  } catch (err) {
    dispatch(fetchJobsFailure(err));
  }
};

export const deleteJobAction = (
  jobId: string
): RootThunk<void> => async dispatch => {
  await deleteJob(jobId);
  dispatch(removeJobComplete(jobId));
};
