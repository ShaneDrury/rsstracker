import { all, call, put, take } from "redux-saga/effects";
import { RemoteFeed } from "../types/feed";
import { episodeActions, UpdateEpisodeComplete } from "./episodes/actions";
import { fetchFeedComplete, fetchFeedStart } from "./feeds/actions";
import { fetchFeed } from "./feeds/sources";

function* fetchFeedSaga(feedId: string) {
  yield put(fetchFeedStart(feedId));
  const feed: RemoteFeed = yield call(fetchFeed, feedId);
  yield put(fetchFeedComplete(feed));
}

function* watchUpdateEpisodeComplete() {
  const { payload }: UpdateEpisodeComplete = yield take(
    episodeActions.UPDATE_EPISODE_COMPLETE
  );
  yield call(fetchFeedSaga, payload.episode.feedId);
}

export default function* rootSaga() {
  yield all([watchUpdateEpisodeComplete()]);
}
