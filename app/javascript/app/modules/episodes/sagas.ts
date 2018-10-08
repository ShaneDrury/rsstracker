import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { fetchFeedRequested } from "../feeds/actions";
import {
  episodeActions,
  FetchEpisodeComplete,
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  FetchEpisodeRequested,
  FetchEpisodesComplete,
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

function* watchEpisodes() {
  const localEpisodes: { [key: string]: RemoteEpisode } = {};

  function* watchFetchEpisodesComplete() {
    yield takeEvery(
      episodeActions.FETCH_EPISODES_COMPLETE,
      ({ payload: { episodes } }: FetchEpisodesComplete) => {
        episodes.forEach(episode => {
          localEpisodes[episode.id] = episode;
        });
      }
    );
  }

  function* watchFetchEpisodeComplete() {
    yield takeEvery(
      episodeActions.FETCH_EPISODE_COMPLETE,
      ({ payload: { episode } }: FetchEpisodeComplete) => {
        localEpisodes[episode.id] = episode;
      }
    );
  }

  function* watchFetchEpisodeRequested() {
    yield takeEvery(episodeActions.FETCH_EPISODE_REQUESTED, function*(
      action: FetchEpisodeRequested
    ) {
      if (!localEpisodes[action.payload.episodeId]) {
        yield fork(fetchEpisode, action);
      }
    });
  }

  yield all([
    call(watchFetchEpisodesComplete),
    call(watchFetchEpisodeComplete),
    call(watchFetchEpisodeRequested),
  ]);
}

export default function* episodesSagas() {
  yield all([
    watchUpdateEpisodeComplete(),
    watchUpdateEpisodeRequested(),
    watchFetchEpisodesRequested(),
    watchEpisodes(),
  ]);
}
