import { RemoteEpisode } from "../../types/episode";
import { RootThunk } from "../../types/thunk";
import { Filter } from "../filters";
import { getFilter } from "./selectors";
import { getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  CHANGE_FILTER = "CHANGE_FILTER"
}

interface FetchEpisodesStart {
  type: episodeActions.FETCH_EPISODES_START;
}

interface FetchEpisodesComplete {
  type: episodeActions.FETCH_EPISODES_COMPLETE;
  payload: {
    episodes: RemoteEpisode[];
  };
}

interface FetchEpisodesFailure {
  type: episodeActions.FETCH_EPISODES_FAILURE;
  payload: {
    error: string;
  };
}

export interface ChangeFilter {
  type: episodeActions.CHANGE_FILTER;
  payload: {
    filter: Filter;
  };
}

export const fetchEpisodesStart = (): FetchEpisodesStart => ({
  type: episodeActions.FETCH_EPISODES_START
});

export const fetchEpisodesComplete = (
  episodes: RemoteEpisode[]
): FetchEpisodesComplete => ({
  type: episodeActions.FETCH_EPISODES_COMPLETE,
  payload: { episodes }
});

export const fetchEpisodesFailure = (error: string): FetchEpisodesFailure => ({
  type: episodeActions.FETCH_EPISODES_FAILURE,
  payload: { error }
});

const changeFilterAction = (filter: Filter): ChangeFilter => ({
  type: episodeActions.CHANGE_FILTER,
  payload: { filter }
});

export type EpisodesAction =
  | FetchEpisodesStart
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | ChangeFilter;

export const fetchEpisodes = (feedId: number): RootThunk<void> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const status = getFilter(state);
  dispatch(fetchEpisodesStart());
  try {
    const episodes = await getEpisodes({ status, feedId });
    dispatch(fetchEpisodesComplete(episodes));
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};

export const changeFilter = (feedId: number) => (
  filter: Filter
): RootThunk<void> => dispatch => {
  dispatch(changeFilterAction(filter));
  dispatch(fetchEpisodes(feedId));
};

export const searchEpisodes = (feedId: number) => (
  searchTerm: string
): RootThunk<void> => async (dispatch, getState) => {
  const state = getState();
  const status = getFilter(state);
  dispatch(fetchEpisodesStart());
  try {
    const episodes = await getEpisodes({ status, feedId, searchTerm });
    dispatch(fetchEpisodesComplete(episodes));
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};
