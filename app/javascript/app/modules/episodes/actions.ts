import { createStandardAction } from "typesafe-actions";
import { RemoteEpisode } from "../../types/episode";
import { StatusCounts } from "../../types/feed";
import { PageInfo } from "../../types/page";
import { RootThunk } from "../../types/thunk";
import { SearchParams } from "../location/queryParams";
import { getEpisodes } from "./sources";

export enum episodeActions {
  FETCH_EPISODES_START = "FETCH_EPISODES_START",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_FAILURE = "FETCH_EPISODES_FAILURE",
  FETCH_EPISODE_REQUESTED = "FETCH_EPISODE_REQUESTED",
  FETCH_EPISODE_START = "FETCH_EPISODE_START",
  FETCH_EPISODE_COMPLETE = "FETCH_EPISODE_COMPLETE",
  FETCH_EPISODE_FAILURE = "FETCH_EPISODE_FAILURE",
  UPDATE_EPISODE_COMPLETE = "UPDATE_EPISODE_COMPLETE",
  UPDATE_EPISODE_REQUESTED = "UPDATE_EPISODE_REQUESTED",
  DETAILS_OPENED = "DETAILS_OPENED",
  DETAILS_CLOSED = "DETAILS_CLOSED",
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

export interface FetchEpisodeRequested {
  type: episodeActions.FETCH_EPISODE_REQUESTED;
  payload: {
    episodeId: string;
  };
}

interface FetchEpisodeComplete {
  type: episodeActions.FETCH_EPISODE_COMPLETE;
  payload: {
    episode: RemoteEpisode;
  };
}

export interface UpdateEpisodeComplete {
  type: episodeActions.UPDATE_EPISODE_COMPLETE;
  payload: {
    episode: RemoteEpisode;
  };
}

interface FetchEpisodeFailure {
  type: episodeActions.FETCH_EPISODE_FAILURE;
  payload: {
    error: string;
    episodeId: string;
  };
}

interface DetailsOpened {
  type: episodeActions.DETAILS_OPENED;
  payload: {
    episodeId: string;
  };
}

interface DetailsClosed {
  type: episodeActions.DETAILS_CLOSED;
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

export const fetchEpisodeRequested = (
  episodeId: string
): FetchEpisodeRequested => ({
  type: episodeActions.FETCH_EPISODE_REQUESTED,
  payload: { episodeId },
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
  episodeId: string
): FetchEpisodeFailure => ({
  type: episodeActions.FETCH_EPISODE_FAILURE,
  payload: { error, episodeId },
});

export interface UpdateEpisodeRequested {
  type: episodeActions.UPDATE_EPISODE_REQUESTED;
  payload: {
    episodeId: string;
    changes: Partial<RemoteEpisode>;
  };
}

export type EpisodesAction =
  | FetchEpisodesStart
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | FetchEpisodeRequested
  | FetchEpisodeComplete
  | FetchEpisodeFailure
  | UpdateEpisodeComplete
  | UpdateEpisodeRequested
  | DetailsOpened
  | DetailsClosed;

export const searchEpisodes = (
  queryParams: SearchParams
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

export const updateEpisodeRequested = (
  episodeId: string,
  changes: Partial<RemoteEpisode>
): UpdateEpisodeRequested => ({
  type: episodeActions.UPDATE_EPISODE_REQUESTED,
  payload: {
    episodeId,
    changes,
  },
});

export const detailsOpened = (episodeId: string): DetailsOpened => ({
  type: episodeActions.DETAILS_OPENED,
  payload: { episodeId },
});

export const detailsClosed = createStandardAction(
  episodeActions.DETAILS_CLOSED
)();
