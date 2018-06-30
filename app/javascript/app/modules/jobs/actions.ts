import { RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { fetchEpisodeIfNeeded } from "../episodes/actions";
import { deleteJob, getJobs } from "./sources";

export enum jobActions {
  FETCH_JOBS_START = "FETCH_JOBS_START",
  FETCH_JOBS_COMPLETE = "FETCH_JOBS_COMPLETE",
  FETCH_JOBS_FAILURE = "FETCH_JOBS_FAILURE",
  JOB_COMPLETE = "JOB_COMPLETE",
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

export type JobsAction =
  | FetchJobsStart
  | FetchJobsComplete
  | FetchJobsFailure
  | JobComplete;

export const fetchJobs = (): RootThunk<void> => async dispatch => {
  dispatch(fetchJobsStart());
  try {
    const jobs = await getJobs();
    jobs.forEach(job => {
      switch (job.jobData.jobClass) {
        case "DownloadEpisodeJob":
        case "DownloadYoutubeAudioJob": {
          dispatch(fetchEpisodeIfNeeded(job.jobData.arguments[0]));
        }
      }
    });
    dispatch(fetchJobsComplete(jobs));
  } catch (err) {
    dispatch(fetchJobsFailure(err));
  }
};

export const deleteJobAction = (
  jobId: string
): RootThunk<void> => async dispatch => {
  await deleteJob(jobId);
};
