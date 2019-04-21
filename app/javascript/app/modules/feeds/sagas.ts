import { all, call, put, takeEvery } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import { feedActions, fetchFeedComplete, FetchFeedRequested } from "./actions";
import { fetchFeed } from "./sources";

function* fetchFeedSaga({ payload: { feedId } }: FetchFeedRequested) {
  const feed: RemoteFeed = yield call(fetchFeed, feedId);
  yield put(fetchFeedComplete(feed));
}

function* watchFetchFeedRequested() {
  yield takeEvery(feedActions.FETCH_FEED_REQUESTED, fetchFeedSaga);
}

export default function* feedSagas() {
  yield all([watchFetchFeedRequested()]);
}
