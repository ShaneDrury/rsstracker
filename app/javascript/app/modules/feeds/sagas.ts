import { uniq } from "lodash";
import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import { isFeedJob, RemoteJob } from "../../types/job";
import { FetchJobsComplete, jobActions, NewJob } from "../jobs/actions";
import { normalize } from "../remoteData";
import {
  feedActions,
  feedsUpdating,
  fetchFeedComplete,
  FetchFeedRequested,
  FetchFeedsComplete,
  fetchFeedsComplete,
  fetchFeedsFailure,
} from "./actions";
import { fetchFeed, fetchFeeds } from "./sources";

function* fetchFeedSaga({ payload: { feedId } }: FetchFeedRequested) {
  const feed: RemoteFeed = yield call(fetchFeed, feedId);
  yield put(fetchFeedComplete(feed));
}

function* watchFetchFeedRequested() {
  yield takeEvery(feedActions.FETCH_FEED_REQUESTED, fetchFeedSaga);
}

function* fetchFeedsSaga() {
  try {
    const items: RemoteFeed[] = yield fetchFeeds();
    yield put(fetchFeedsComplete(items));
  } catch (err) {
    yield put(fetchFeedsFailure(err));
  }
}

function* watchFetchFeedsRequested() {
  yield takeEvery(feedActions.FETCH_FEEDS_REQUESTED, fetchFeedsSaga);
}

const feedsForSource = (feeds: RemoteFeed[], sourceId: number) =>
  uniq(
    feeds.filter(feed =>
      feed.sources.map(source => source.id).includes(sourceId)
    )
  );

function* processNewJob(feeds: { [key: string]: RemoteFeed }, job: RemoteJob) {
  if (isFeedJob(job)) {
    const sourceId = job.jobData.arguments[0];
    yield put(
      feedsUpdating(feedsForSource(Object.values(feeds), sourceId), job)
    );
  }
}

function* processNewJobs(
  feeds: { [key: string]: RemoteFeed },
  jobs: RemoteJob[]
) {
  yield all(jobs.map(job => call(processNewJob, feeds, job)));
}

function* watchFeeds() {
  let localFeeds: { [key: string]: RemoteFeed } = {};

  function* watchFetchFeedsComplete() {
    while (true) {
      const {
        payload: { feeds },
      }: FetchFeedsComplete = yield take(feedActions.FETCH_FEEDS_COMPLETE);
      const { items } = normalize(feeds);
      localFeeds = items;
    }
  }

  function* watchNewJob() {
    while (true) {
      const {
        payload: { job },
      }: NewJob = yield take(jobActions.NEW_JOB);
      yield call(processNewJob, localFeeds, job);
    }
  }

  function* watchFetchJobsComplete() {
    while (true) {
      const {
        payload: { jobs },
      }: FetchJobsComplete = yield take(jobActions.FETCH_JOBS_COMPLETE);
      yield call(processNewJobs, localFeeds, jobs);
    }
  }

  yield all([
    call(watchFetchFeedsComplete),
    call(watchNewJob),
    call(watchFetchJobsComplete),
  ]);
}

export default function* feedSagas() {
  yield all([
    watchFetchFeedRequested(),
    watchFetchFeedsRequested(),
    watchFeeds(),
  ]);
}
