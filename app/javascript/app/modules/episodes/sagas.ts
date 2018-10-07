import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { fetchFeedRequested } from "../feeds/actions";
import {
  episodeActions,
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  FetchEpisodeRequested,
  fetchEpisodesComplete,
  fetchEpisodesFailure,
  FetchEpisodesRequested,
  UpdateEpisodeComplete,
  UpdateEpisodeRequested,
} from "./actions";
import {
  getEpisode,
  getEpisodes,
  updateEpisodeDate,
  updateEpisodeDescription,
} from "./sources";

function* fetchEpisode({ payload: { episodeId } }: FetchEpisodeRequested) {
  try {
    const episode: RemoteEpisode = yield call(getEpisode, episodeId);
    yield put(fetchEpisodeComplete(episode));
  } catch (err) {
    yield put(fetchEpisodeFailure(err, episodeId));
  }
}

function* fetchEpisodeListener() {
  yield takeEvery(episodeActions.FETCH_EPISODE_REQUESTED, fetchEpisode);
}

function* watchUpdateEpisodeComplete() {
  while (true) {
    const { payload }: UpdateEpisodeComplete = yield take(
      // TODO: takeLatest
      episodeActions.UPDATE_EPISODE_COMPLETE
    );
    yield put(fetchFeedRequested(payload.episode.feedId));
  }
}

function* updateEpisodeSaga({
  payload: { episodeId, changes },
}: UpdateEpisodeRequested) {
  if (changes.description) {
    yield updateEpisodeDescription(episodeId, changes.description);
  }
  if (changes.publicationDate) {
    yield updateEpisodeDate(episodeId, changes.publicationDate);
  }
}

function* watchUpdateEpisodeRequested() {
  yield takeEvery(episodeActions.UPDATE_EPISODE_REQUESTED, updateEpisodeSaga);
}

function* fetchEpisodesSaga({
  payload: { queryParams },
}: FetchEpisodesRequested) {
  try {
    const episodes = yield getEpisodes(queryParams);
    yield put(
      fetchEpisodesComplete(
        episodes.items,
        episodes.pageInfo,
        episodes.statusCounts
      )
    );
  } catch (err) {
    yield put(fetchEpisodesFailure(err));
  }
}

function* watchFetchEpisodesRequested() {
  yield takeEvery(episodeActions.FETCH_EPISODES_REQUESTED, fetchEpisodesSaga);
}

export default function* episodesSagas() {
  yield all([
    fetchEpisodeListener(),
    watchUpdateEpisodeComplete(),
    watchUpdateEpisodeRequested(),
    watchFetchEpisodesRequested(),
  ]);
}
