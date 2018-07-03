import { RemoteEpisode } from "../../types/episode";
import { StatusCounts } from "../../types/feed";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { QueryParams } from "../location/queryParams";
import { Status } from "../status";
import { getEpisodes as getEpisodesSelector } from "./selectors";
import { getEpisode, getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  FETCH_EPISODE_START = "FETCH_EPISODE_START",
  FETCH_EPISODE_COMPLETE = "FETCH_EPISODE_COMPLETE",
  FETCH_EPISODE_FAILURE = "FETCH_EPISODE_FAILURE",
  UPDATE_EPISODE_COMPLETE = "UPDATE_EPISODE_COMPLETE",
  PAGE_CHANGED = "PAGE_CHANGED",
  FILTER_CHANGED = "FILTER_CHANGED",
  SEARCH_CHANGED = "SEARCH_CHANGED",
}

interface FetchEpisodesStart {
  type: episodeActions.FETCH_EPISODES_START;
}

interface FetchEpisodesComplete {
  type: episodeActions.FETCH_EPISODES_COMPLETE;
  payload: {
    episodes: RemoteEpisode[];
    pageInfo: PageInfo;
    statusCounts: StatusCounts;
  };
}

interface FetchEpisodesFailure {
  type: episodeActions.FETCH_EPISODES_FAILURE;
  payload: {
    error: string;
  };
}

interface PageChanged {
  type: episodeActions.PAGE_CHANGED;
  payload: {
    currentPage: number;
  };
}

interface FilterChanged {
  type: episodeActions.FILTER_CHANGED;
  payload: {
    status: Status;
  };
}

interface SearchChanged {
  type: episodeActions.SEARCH_CHANGED;
  payload: {
    searchTerm: string;
  };
}

interface FetchEpisodeStart {
  type: episodeActions.FETCH_EPISODE_START;
}

interface FetchEpisodeComplete {
  type: episodeActions.FETCH_EPISODE_COMPLETE;
  payload: {
    episode: RemoteEpisode;
  };
}

interface UpdateEpisodeComplete {
  type: episodeActions.UPDATE_EPISODE_COMPLETE;
  payload: {
    episode: RemoteEpisode;
  };
}

interface FetchEpisodeFailure {
  type: episodeActions.FETCH_EPISODE_FAILURE;
  payload: {
    error: string;
    episodeId: number;
  };
}

export const fetchEpisodesStart = (): FetchEpisodesStart => ({
  type: episodeActions.FETCH_EPISODES_START,
});

export const fetchEpisodesComplete = (
  episodes: RemoteEpisode[],
  pageInfo: PageInfo,
  statusCounts: StatusCounts
): FetchEpisodesComplete => ({
  type: episodeActions.FETCH_EPISODES_COMPLETE,
  payload: { episodes, pageInfo, statusCounts },
});

export const fetchEpisodesFailure = (error: string): FetchEpisodesFailure => ({
  type: episodeActions.FETCH_EPISODES_FAILURE,
  payload: { error },
});

export const fetchEpisodeStart = (): FetchEpisodeStart => ({
  type: episodeActions.FETCH_EPISODE_START,
});

export const fetchEpisodeComplete = (
  episode: RemoteEpisode
): FetchEpisodeComplete => ({
  type: episodeActions.FETCH_EPISODE_COMPLETE,
  payload: { episode },
});

export const updateEpisodeComplete = (
  episode: RemoteEpisode
): UpdateEpisodeComplete => ({
  type: episodeActions.UPDATE_EPISODE_COMPLETE,
  payload: { episode },
});

export const fetchEpisodeFailure = (
  error: string,
  episodeId: number
): FetchEpisodeFailure => ({
  type: episodeActions.FETCH_EPISODE_FAILURE,
  payload: { error, episodeId },
});

export type EpisodesAction =
  | FetchEpisodesStart
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | PageChanged
  | FilterChanged
  | SearchChanged
  | FetchEpisodeStart
  | FetchEpisodeComplete
  | FetchEpisodeFailure
  | UpdateEpisodeComplete;

export const changeFilter = (status: Status): FilterChanged => ({
  type: episodeActions.FILTER_CHANGED,
  payload: { status },
});

export const changeSearch = (searchTerm: string): SearchChanged => ({
  type: episodeActions.SEARCH_CHANGED,
  payload: { searchTerm },
});

export const searchEpisodes = (
  queryParams: QueryParams
): RootThunk<void> => async dispatch => {
  dispatch(fetchEpisodesStart());
  try {
    const episodes = await getEpisodes(queryParams);
    dispatch(
      fetchEpisodesComplete(
        episodes.items,
        episodes.pageInfo,
        episodes.statusCounts
      )
    );
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};

export const changePage = (currentPage: number): PageChanged => ({
  type: episodeActions.PAGE_CHANGED,
  payload: { currentPage },
});

export const fetchEpisode = (
  episodeId: number
): RootThunk<void> => async dispatch => {
  dispatch(fetchEpisodeStart());
  try {
    const episode = await getEpisode(episodeId);
    dispatch(fetchEpisodeComplete(episode));
  } catch (err) {
    dispatch(fetchEpisodeFailure(err, episodeId));
  }
};

export const fetchEpisodeIfNeeded = (episodeId: number): RootThunk<void> => (
  dispatch,
  getState
) => {
  const state = getState();
  if (!getEpisodesSelector(state)[episodeId]) {
    dispatch(fetchEpisode(episodeId));
  }
};
