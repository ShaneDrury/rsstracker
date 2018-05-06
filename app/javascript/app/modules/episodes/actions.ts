import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { Filter } from "../filters";
import { getFilter, getPageInfo, getSearchTerm } from "./selectors";
import { getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  CHANGE_PAGE = "CHANGE_PAGE",
  CHANGE_STATUS = "CHANGE_STATUS",
  CHANGE_SEARCH_TERM = "CHANGE_SEARCH_TERM",
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

interface ChangePage {
  type: episodeActions.CHANGE_PAGE;
  payload: {
    currentPage: number;
  };
}

interface ChangeStatus {
  type: episodeActions.CHANGE_STATUS;
  payload: {
    status: Filter;
  };
}

interface ChangeSearchTerm {
  type: episodeActions.CHANGE_SEARCH_TERM;
  payload: {
    searchTerm: string;
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

export type EpisodesAction =
  | FetchEpisodesStart
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | ChangePage
  | ChangeStatus
  | ChangeSearchTerm;

export const searchEpisodes = (feedId: number): RootThunk<void> => async (
  dispatch,
  getState
) => {
  const state = getState();
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
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};

export const changePageAction = (currentPage: number): ChangePage => ({
  type: episodeActions.CHANGE_PAGE,
  payload: { currentPage },
});

export const changeStatusAction = (status: Filter): ChangeStatus => ({
  type: episodeActions.CHANGE_STATUS,
  payload: { status },
});

export const changeSearchTermAction = (
  searchTerm: string
): ChangeSearchTerm => ({
  type: episodeActions.CHANGE_SEARCH_TERM,
  payload: { searchTerm },
});

export const changePage = (
  currentPage: number,
  feedId: number
): RootThunk<void> => async dispatch => {
  dispatch(changePageAction(currentPage));
  dispatch(searchEpisodes(feedId));
};

export const changeStatus = (
  status: Filter,
  feedId: number
): RootThunk<void> => async dispatch => {
  dispatch(changeStatusAction(status));
  dispatch(searchEpisodes(feedId));
};

export const changeSearchTerm = (
  searchTerm: string,
  feedId: number
): RootThunk<void> => async dispatch => {
  dispatch(changeSearchTermAction(searchTerm));
  dispatch(searchEpisodes(feedId));
};
