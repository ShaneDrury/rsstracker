import { all, call, fork, put, take } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { fetchFeedRequested } from "../feeds/actions";
import {
  episodeActions,
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  FetchEpisodeRequested,
  UpdateEpisodeComplete,
} from "./actions";
import { getEpisode } from "./sources";

export function* fetchEpisode(episodeId: string) {
  try {
    const episode: RemoteEpisode = yield call(getEpisode, episodeId);
    yield put(fetchEpisodeComplete(episode));
  } catch (err) {
    yield put(fetchEpisodeFailure(err, episodeId));
  }
}

export function* fetchEpisodeListener() {
  while (true) {
    const { payload }: FetchEpisodeRequested = yield take(
      episodeActions.FETCH_EPISODE_REQUESTED
    );
    yield fork(fetchEpisode, payload.episodeId);
  }
}

export function* watchUpdateEpisodeComplete() {
  while (true) {
    const { payload }: UpdateEpisodeComplete = yield take(
      // TODO: takeLatest
      episodeActions.UPDATE_EPISODE_COMPLETE
    );
    yield put(fetchFeedRequested(payload.episode.feedId));
  }
}

export default function* episodesSagas() {
  yield all([fetchEpisodeListener(), watchUpdateEpisodeComplete()]);
}
