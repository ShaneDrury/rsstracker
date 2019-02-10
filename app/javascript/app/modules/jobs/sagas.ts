import { uniq } from "lodash";
import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import { isFeedJob, RemoteJob } from "../../types/job";
import { fetchEpisodeRequested } from "../episodes/actions";
import {
  feedActions,
  feedsUpdating,
  FetchFeedsComplete,
} from "../feeds/actions";
import { normalize } from "../remoteData";
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
  switch (job.jobData.jobClass) {
    case "DownloadYoutubeAudioJob":
    case "DownloadEpisodeJob": {
      yield put(fetchEpisodeRequested(job.jobData.arguments[0].toString(10)));
      break;
    }
    default:
  }
}

const feedsForSource = (feeds: RemoteFeed[], sourceId: number) =>
  uniq(
    feeds.filter(feed =>
      feed.sources.map(source => source.id).includes(sourceId)
    )
  );

export function* watchJobs() {
  let localJobs: { [key: string]: RemoteJob } = {};
  let localFeeds: { [key: string]: RemoteFeed } = {};

  function* watchFetchJobsComplete() {
    while (true) {
      const {
        payload: { jobs },
      }: FetchJobsComplete = yield take(jobActions.FETCH_JOBS_COMPLETE);
      yield all(jobs.map(job => fork(fetchRelatedEpisode, job)));
      localJobs = normalize(jobs).items;
      const feedJobs = jobs.filter(isFeedJob);
      const updatingFeeds = feedJobs.map(job => {
        const sourceId = job.jobData.arguments[0];
        return {
          job,
          feeds: feedsForSource(Object.values(localFeeds), sourceId),
        };
      });

      yield all(
        updatingFeeds.map(updating =>
          put(feedsUpdating(updating.feeds, updating.job))
        )
      );
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

  function* watchFetchFeedsComplete() {
    while (true) {
      const {
        payload: { feeds },
      }: FetchFeedsComplete = yield take(feedActions.FETCH_FEEDS_COMPLETE);
      const { items } = normalize(feeds);
      localFeeds = items;
    }
  }

  yield all([
    call(watchFetchJobsComplete),
    call(watchJobComplete),
    call(watchNewJob),
    call(watchFetchFeedsComplete),
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
