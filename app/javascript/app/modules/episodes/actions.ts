import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { updateEpisodeStarted } from "../episodeJobs/actions";
import { getFeedId } from "../feeds/selectors";
import { Filter } from "../filters";
import { fetchJobsComplete } from "../jobs/actions";
import { processJobResponse } from "../jobs/sources";
import { fetchStatusesComplete } from "../statusCounts/actions";
import {
  getEpisodes as getEpisodesSelector,
  getFetchStatus,
  getFilter,
  getPageInfo,
  getSearchTerm,
} from "./selectors";
import { downloadEpisode, getEpisode, getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  PAGE_CHANGED = "PAGE_CHANGED",
  FETCH_EPISODE_START = "FETCH_EPISODE_START",
  FETCH_EPISODE_COMPLETE = "FETCH_EPISODE_COMPLETE",
  FETCH_EPISODE_FAILURE = "FETCH_EPISODE_FAILURE",
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
    filter: Filter;
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
  pageInfo: PageInfo
): FetchEpisodesComplete => ({
  type: episodeActions.FETCH_EPISODES_COMPLETE,
  payload: { episodes, pageInfo },
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
  | FetchEpisodeFailure;

export const changeFilter = (filter: Filter): FilterChanged => ({
  type: episodeActions.FILTER_CHANGED,
  payload: { filter },
});

export const changeSearch = (searchTerm: string): SearchChanged => ({
  type: episodeActions.SEARCH_CHANGED,
  payload: { searchTerm },
});

export const changeFilterAction = (
  filter: Filter
): RootThunk<void> => dispatch => {
  dispatch(changeFilter(filter));
  dispatch(searchEpisodes());
};

export const changeSearchAction = (
  searchTerm: string
): RootThunk<void> => dispatch => {
  dispatch(changeSearch(searchTerm));
  dispatch(searchEpisodes());
};

export const searchEpisodes = (): RootThunk<void> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const fetchStatus = getFetchStatus(state);
  if (fetchStatus === "LOADING") {
    return;
  }
  const feedId = getFeedId(state);
  const searchTerm = getSearchTerm(state);
  const status = getFilter(state);
  const pageInfo = getPageInfo(state);
  const currentPage = pageInfo && pageInfo.currentPage;
  dispatch(fetchEpisodesStart());
  try {
    const episodes = await getEpisodes({
      status,
      feedId,
      searchTerm,
      currentPage,
    });
    dispatch(fetchEpisodesComplete(episodes.items, episodes.pageInfo));
    dispatch(fetchStatusesComplete(episodes.statusCounts));
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};

export const changePageAction = (currentPage: number): PageChanged => ({
  type: episodeActions.PAGE_CHANGED,
  payload: { currentPage },
});

export const changePage = (
  currentPage: number
): RootThunk<void> => async dispatch => {
  dispatch(changePageAction(currentPage));
  dispatch(searchEpisodes());
};

export const downloadEpisodeAction = (
  episodeId: number
): RootThunk<void> => async dispatch => {
  const downloadResponse = await downloadEpisode(episodeId);
  const job = processJobResponse(downloadResponse.job);
  dispatch(updateEpisodeStarted(job.id, episodeId));
  dispatch(fetchJobsComplete([job]));
};

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
