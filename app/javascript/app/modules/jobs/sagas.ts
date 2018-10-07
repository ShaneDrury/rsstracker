import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { RemoteJob } from "../../types/job";
import { fetchEpisodeRequested } from "../episodes/actions";
import {
  FetchJobsComplete,
  fetchJobsComplete,
  fetchJobsStart,
  jobActions,
  JobComplete,
  NewJob,
  removeJobComplete,
  RemoveJobRequested,
} from "./actions";
import { deleteJob, getJobs } from "./sources";

const jobsToMap = (jobsArray: RemoteJob[]): { [key: string]: RemoteJob } => {
  const jobs: { [key: string]: RemoteJob } = {};
  jobsArray.forEach(job => {
    jobs[job.id] = job;
  });
  return jobs;
};

function* fetchJobsSaga() {
  yield put(fetchJobsStart());
  const jobs: RemoteJob[] = yield call(getJobs);
  yield put(fetchJobsComplete(jobs));
}

function* watchJobsRequested() {
  yield takeEvery(jobActions.FETCH_JOBS_REQUESTED, fetchJobsSaga);
}

export function* watchJobs() {
  let jobs: { [key: string]: RemoteJob } = {};

  function* watchJobsComplete() {
    const { payload }: FetchJobsComplete = yield take(
      jobActions.FETCH_JOBS_COMPLETE
    );
    jobs = jobsToMap(payload.jobs);
  }

  function* watchJobComplete() {
    while (true) {
      const {
        payload: { jobId },
      }: JobComplete = yield take(jobActions.JOB_COMPLETE);
      const job = jobs[jobId];
      if (job) {
        switch (job.jobData.jobClass) {
          case "DownloadYoutubeAudioJob":
          case "DownloadEpisodeJob": {
            yield put(
              fetchEpisodeRequested(job.jobData.arguments[0].toString(10))
            );
            break;
          }
          default:
        }
        const { [jobId]: _, ...newJobs } = jobs;
        jobs = newJobs;
      }
    }
  }

  function* watchNewJob() {
    while (true) {
      const {
        payload: { job },
      }: NewJob = yield take(jobActions.NEW_JOB);
      jobs[job.id] = job;
    }
  }

  yield all([
    call(watchJobsComplete),
    call(watchJobComplete),
    call(watchNewJob),
  ]);
}

function* removeJob({ payload }: RemoveJobRequested) {
  yield deleteJob(payload.jobId);
  put(removeJobComplete(payload.jobId));
}

function* watchRemoveJobRequested() {
  yield takeEvery(jobActions.REMOVE_JOB_REQUESTED, removeJob);
}

export default function* jobsSagas() {
  yield all([watchJobs(), watchJobsRequested(), watchRemoveJobRequested()]);
}