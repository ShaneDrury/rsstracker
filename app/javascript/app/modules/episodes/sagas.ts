import { all, call, fork, put, take } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import {
  episodeActions,
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  FetchEpisodeRequested,
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

export default function* episodesSagas() {
  yield all([fetchEpisodeListener()]);
}
