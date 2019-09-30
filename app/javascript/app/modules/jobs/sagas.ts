import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteJob } from "../../types/job";
import { fetchEpisodeRequested } from "../episodes/actions";
import {
  FetchJobsComplete,
  fetchJobsComplete,
  jobActions,
  JobComplete,
  NewJob,
  removeJobComplete,
  RemoveJobRequested,
} from "./actions";
import { deleteJob, getJobs } from "./sources";

function* fetchJobsSaga() {
  const jobs: RemoteJob[] = yield call(getJobs);
  yield put(fetchJobsComplete(jobs));
}

function* watchJobsRequested() {
  yield takeEvery(jobActions.FETCH_JOBS_REQUESTED, fetchJobsSaga);
}

function* fetchRelatedEpisode(job: RemoteJob) {
  switch (job.jobClass) {
    case "DownloadRemoteAudioJob": {
      yield put(fetchEpisodeRequested(job.arguments[0].toString(10)));
      break;
    }
    default:
  }
}

export function* watchJobs() {
  let localJobs: { [key: string]: RemoteJob } = {};

  function* watchFetchJobsComplete() {
    while (true) {
      const {
        payload: { jobs },
      }: FetchJobsComplete = yield take(jobActions.FETCH_JOBS_COMPLETE);
      yield all(jobs.map(job => fork(fetchRelatedEpisode, job)));
    }
  }

  function* watchJobComplete() {
    while (true) {
      const {
        payload: { jobId },
      }: JobComplete = yield take(jobActions.JOB_COMPLETE);
      const job = localJobs[jobId];
      if (job) {
        yield fork(fetchRelatedEpisode, job); // TODO: Change to refetch requested
        const { [jobId]: _, ...newJobs } = localJobs;
        localJobs = newJobs;
      }
    }
  }

  function* watchNewJob() {
    while (true) {
      const {
        payload: { job },
      }: NewJob = yield take(jobActions.NEW_JOB);
      yield fork(fetchRelatedEpisode, job);
      localJobs[job.id] = job;
    }
  }

  yield all([
    call(watchFetchJobsComplete),
    call(watchJobComplete),
    call(watchNewJob),
  ]);
}

function* removeJob({ payload }: RemoveJobRequested) {
  yield deleteJob(payload.jobId);
  yield put(removeJobComplete(payload.jobId));
}

function* watchRemoveJobRequested() {
  yield takeEvery(jobActions.REMOVE_JOB_REQUESTED, removeJob);
}

export default function* jobsSagas() {
  yield all([watchJobs(), watchJobsRequested(), watchRemoveJobRequested()]);
}
