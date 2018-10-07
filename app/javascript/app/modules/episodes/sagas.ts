import { call, put } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import {
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  fetchEpisodeStart,
} from "./actions";
import { getEpisode } from "./sources";

export function* fetchEpisodeSaga(episodeId: string) {
  yield put(fetchEpisodeStart(episodeId));
  try {
    const episode: RemoteEpisode = yield call(getEpisode, episodeId);
    yield put(fetchEpisodeComplete(episode));
  } catch (err) {
    yield put(fetchEpisodeFailure(err, episodeId));
  }
}
