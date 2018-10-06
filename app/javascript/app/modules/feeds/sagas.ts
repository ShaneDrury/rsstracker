import { call, put, take } from "redux-saga/effects";
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
  const { payload }: UpdateEpisodeComplete = yield take(
    episodeActions.UPDATE_EPISODE_COMPLETE
  );
  yield call(fetchFeedSaga, payload.episode.feedId);
}
