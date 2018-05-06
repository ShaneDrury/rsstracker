import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { Filter } from "../filters";
import { getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
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
  | FetchEpisodesFailure;

export const searchEpisodes = (
  status: Filter,
  searchTerm: string,
  feedId: number
): RootThunk<void> => async dispatch => {
  dispatch(fetchEpisodesStart());
  try {
    const episodes = await getEpisodes({ status, feedId, searchTerm });
    dispatch(fetchEpisodesComplete(episodes.items, episodes.pageInfo));
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};
