import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { updateEpisodeStart } from "../episodeJobs/actions";
import { getFeedId } from "../feeds/selectors";
import { fetchJobsComplete } from "../jobs/actions";
import { processJobResponse } from "../jobs/sources";
import { getFilter, getPageInfo, getSearchTerm } from "./selectors";
import { downloadEpisode, getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  CHANGE_PAGE = "CHANGE_PAGE",
  FETCH_EPISODE_COMPLETE = "FETCH_EPISODE_COMPLETE",
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

interface FetchEpisodeComplete {
  type: episodeActions.FETCH_EPISODE_COMPLETE;
  payload: {
    episode: RemoteEpisode;
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

export const fetchEpisodeComplete = (
  episode: RemoteEpisode
): FetchEpisodeComplete => ({
  type: episodeActions.FETCH_EPISODE_COMPLETE,
  payload: { episode },
});

export type EpisodesAction =
  | FetchEpisodesStart
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | ChangePage
  | FetchEpisodeComplete;

export const searchEpisodes = (): RootThunk<void> => async (
  dispatch,
  getState
) => {
  const state = getState();
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
  } catch (err) {
    dispatch(fetchEpisodesFailure(err));
  }
};

export const changePageAction = (currentPage: number): ChangePage => ({
  type: episodeActions.CHANGE_PAGE,
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
  dispatch(updateEpisodeStart(job.providerJobId, episodeId));
  dispatch(fetchJobsComplete([job]));
};
