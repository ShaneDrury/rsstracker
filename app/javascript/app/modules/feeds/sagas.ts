import { all, call, put, takeEvery } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import {
  feedActions,
  fetchFeedComplete,
  FetchFeedRequested,
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
