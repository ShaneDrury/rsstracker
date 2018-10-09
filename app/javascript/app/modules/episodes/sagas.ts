import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { fetchFeedRequested } from "../feeds/actions";
import {
  episodeActions,
  FetchEpisodeComplete,
  fetchEpisodeComplete,
  fetchEpisodeFailure,
  fetchEpisodeRequested,
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

interface Pending {
  fetchedAll: boolean;
  episodeIds: Set<string>;
}

function* watchEpisodes() {
  // TODO: This may just need to be a list of ids of fetched eps
  const localEpisodes: { [key: string]: RemoteEpisode } = {};

  const pending: Pending = {
    fetchedAll: false,
    episodeIds: new Set(),
  };

  function* watchFetchEpisodesComplete() {
    yield takeEvery(episodeActions.FETCH_EPISODES_COMPLETE, function*({
      payload: { episodes },
    }: FetchEpisodesComplete) {
      episodes.forEach(episode => {
        localEpisodes[episode.id] = episode;
      });
      pending.fetchedAll = true;
      yield all(
        Array.from(pending.episodeIds).map(episodeId =>
          put(fetchEpisodeRequested(episodeId))
        )
      );
    });
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
      if (!pending.fetchedAll) {
        pending.episodeIds.add(action.payload.episodeId);
        return;
      }
      if (!localEpisodes[action.payload.episodeId]) {
        yield fork(fetchEpisode, action);
        pending.episodeIds.delete(action.payload.episodeId);
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
