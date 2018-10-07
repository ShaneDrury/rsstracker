import { all, call, fork, put, take } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import { episodeActions, UpdateEpisodeComplete } from "../episodes/actions";
import {
  feedActions,
  fetchFeedComplete,
  FetchFeedRequested,
  fetchFeedRequested,
} from "./actions";
import { fetchFeed } from "./sources";

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

export default function* feedSagas() {
  yield all([watchFetchFeedRequested()]);
}
