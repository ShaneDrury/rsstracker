import { call, fork, put, take } from "redux-saga/effects";
import { RemoteFeed } from "../../types/feed";
import { episodeActions, UpdateEpisodeComplete } from "../episodes/actions";
import { fetchFeedComplete, fetchFeedStart } from "./actions";
import { fetchFeed } from "./sources";

function* fetchFeedSaga(feedId: string) {
  yield put(fetchFeedStart(feedId));
  const feed: RemoteFeed = yield call(fetchFeed, feedId);
  yield put(fetchFeedComplete(feed));
}

export function* watchUpdateEpisodeComplete() {
  while (true) {
    const { payload }: UpdateEpisodeComplete = yield take(
      // TODO: takeLatest
      episodeActions.UPDATE_EPISODE_COMPLETE
    );
    yield fork(fetchFeedSaga, payload.episode.feedId);
  }
}
