import { delay, Task } from "redux-saga";
import {
  all,
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
} from "redux-saga/effects";
import { RemoteEpisode } from "../../types/episode";
import { fetchFeedRequested } from "../feeds/actions";
import {
  episodeActions,
  episodeSeen,
  FetchEpisodeComplete,
  fetchEpisodeRequested,
  FetchEpisodeRequested,
  fetchEpisodesByIdComplete,
  FetchEpisodesComplete,
  fetchEpisodesComplete,
  fetchEpisodesFailure,
  FetchEpisodesRequested,
  UpdateEpisodeComplete,
  UpdateEpisodeRequested,
  VisibilityChanged,
} from "./actions";
import {
  getEpisodes,
  getEpisodesById,
  updateEpisodeDate,
  updateEpisodeDescription,
} from "./sources";

function* fetchEpisodesById(episodeIds: string[]) {
  const episodes: RemoteEpisode[] = yield call(getEpisodesById, episodeIds);
  yield put(fetchEpisodesByIdComplete(episodes));
}

function* watchUpdateEpisodeComplete() {
  while (true) {
    const { payload }: UpdateEpisodeComplete = yield take(
      // TODO: takeLatest
      // TODO: Either stop dispatching so many UPDATE_EPISODE events
      // or batch up the resulting events
      // Only dispatch fetchFeedRequested if what's changed actually affects
      // the feed.
      // Might need a local store of episodes to check here
      // with
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
    yield put(fetchEpisodesComplete(episodes.items, episodes.pageInfo));
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
  const localEpisodes: Set<string> = new Set();

  const pending: Pending = {
    fetchedAll: false,
    episodeIds: new Set(),
  };

  function* watchFetchEpisodesComplete() {
    yield takeEvery(
      [
        episodeActions.FETCH_EPISODES_COMPLETE,
        episodeActions.FETCH_EPISODES_BY_ID_COMPLETE,
      ],
      function*({ payload: { episodes } }: FetchEpisodesComplete) {
        episodes.forEach(episode => {
          localEpisodes.add(episode.id);
        });
        pending.fetchedAll = true;
        yield all(
          Array.from(pending.episodeIds).map(episodeId =>
            put(fetchEpisodeRequested(episodeId))
          )
        );
      }
    );
  }

  function* watchFetchEpisodeComplete() {
    yield takeEvery(
      episodeActions.FETCH_EPISODE_COMPLETE,
      ({ payload: { episode } }: FetchEpisodeComplete) => {
        localEpisodes.add(episode.id);
      }
    );
  }

  function* watchFetchEpisodeRequested() {
    yield takeEvery(episodeActions.FETCH_EPISODE_REQUESTED, function*(
      action: FetchEpisodeRequested
    ) {
      const episodeId = action.payload.episodeId;
      if (!pending.fetchedAll) {
        pending.episodeIds.add(episodeId);
        return;
      }
      if (!localEpisodes.has(episodeId)) {
        pending.episodeIds.add(episodeId); // TODO: split this out to separate watcher
        // e.g. can have a separate watcher with local pending ids, if we need to communicate
        // use events
        yield delay(10);
        if (pending.episodeIds.has(episodeId)) {
          yield fork(fetchEpisodesById, Array.from(pending.episodeIds));
          pending.episodeIds = new Set();
        }
      }
    });
  }

  yield all([
    watchFetchEpisodesComplete(),
    watchFetchEpisodeComplete(),
    watchFetchEpisodeRequested(),
  ]);
}

function* watchVisibilityChanged() {
  const episodeTimerTasks = new Map<string, Task>();

  function* episodeIsBeingLookedAt(episodeId: string) {
    yield delay(5000);
    yield put(episodeSeen(episodeId));
    episodeTimerTasks.delete(episodeId);
  }

  yield takeEvery(episodeActions.VISIBILITY_CHANGED, function*({
    payload,
  }: VisibilityChanged) {
    if (payload.isVisible) {
      const task = yield fork(episodeIsBeingLookedAt, payload.episodeId);
      episodeTimerTasks.set(payload.episodeId, task);
    }
    if (!payload.isVisible) {
      const task = episodeTimerTasks.get(payload.episodeId);
      if (task) {
        yield cancel(task);
        episodeTimerTasks.delete(payload.episodeId);
      }
    }
  });
}

export default function* episodesSagas() {
  yield all([
    watchUpdateEpisodeComplete(),
    watchUpdateEpisodeRequested(),
    watchFetchEpisodesRequested(),
    watchEpisodes(),
    watchVisibilityChanged(),
  ]);
}
