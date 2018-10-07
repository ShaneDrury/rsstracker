import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import {
  feedActions,
  fetchFeedComplete,
  FetchFeedRequested,
  fetchFeedsComplete,
  fetchFeedsFailure,
} from "./actions";
import { fetchFeed, fetchFeeds } from "./sources";

function* fetchFeedSaga(feedId: string) {
  const feed: RemoteFeed = yield call(fetchFeed, feedId);
  yield put(fetchFeedComplete(feed));
}

function* watchFetchFeedRequested() {
  while (true) {
    const {
      payload: { feedId },
    }: FetchFeedRequested = yield take(feedActions.FETCH_FEED_REQUESTED);
    yield fork(fetchFeedSaga, feedId);
  }
}

function* fetchFeedsSaga() {
  try {
    const { items, statusCounts } = yield fetchFeeds();
    yield put(fetchFeedsComplete(items, statusCounts));
  } catch (err) {
    yield put(fetchFeedsFailure(err));
  }
}

function* watchFetchFeedsRequested() {
  yield takeEvery(feedActions.FETCH_FEEDS_REQUESTED, fetchFeedsSaga);
}

export default function* feedSagas() {
  yield all([watchFetchFeedRequested(), watchFetchFeedsRequested()]);
}
