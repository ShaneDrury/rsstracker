import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { RemoteJob } from "../../types/job";
import {
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  fetchEpisodeStart,
} from "../episodes/actions";
import { getEpisode } from "../episodes/sources";
import {
  FetchJobsComplete,
  fetchJobsComplete,
  fetchJobsStart,
  jobActions,
  JobComplete,
  NewJob,
} from "./actions";
import { getJobs } from "./sources";

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

function* fetchEpisodeSaga(episodeId: string) {
  yield put(fetchEpisodeStart(episodeId));
  try {
    const episode: RemoteEpisode = yield call(getEpisode, episodeId);
    yield put(fetchEpisodeComplete(episode));
  } catch (err) {
    yield put(fetchEpisodeFailure(err, episodeId));
  }
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
            yield fork(fetchEpisodeSaga, job.jobData.arguments[0].toString(10));
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

export default function* jobsSagas() {
  yield fork(watchJobs);
  yield fork(watchJobsRequested);
}
