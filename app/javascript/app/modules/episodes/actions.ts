import { createStandardAction } from "typesafe-actions";
import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { SearchParams } from "../location/queryParams";

export enum episodeActions {
  FETCH_EPISODES_REQUESTED = "FETCH_EPISODES_REQUESTED",
  FETCH_EPISODES_COMPLETE = "FETCH_EPISODES_COMPLETE",
  FETCH_EPISODES_BY_ID_COMPLETE = "FETCH_EPISODES_BY_ID_COMPLETE",
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

export interface FetchEpisodesRequested {
  type: episodeActions.FETCH_EPISODES_REQUESTED;
  payload: {
    queryParams: SearchParams;
  };
}

export interface FetchEpisodesComplete {
  type: episodeActions.FETCH_EPISODES_COMPLETE;
  payload: {
    episodes: RemoteEpisode[];
    pageInfo: PageInfo;
  };
}

export interface FetchEpisodesByIdComplete {
  type: episodeActions.FETCH_EPISODES_BY_ID_COMPLETE;
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

export interface FetchEpisodeRequested {
  type: episodeActions.FETCH_EPISODE_REQUESTED;
  payload: {
    episodeId: string;
  };
}

export interface FetchEpisodeComplete {
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

export const fetchEpisodesRequested = (
  queryParams: SearchParams
): FetchEpisodesRequested => ({
  type: episodeActions.FETCH_EPISODES_REQUESTED,
  payload: { queryParams },
});

export const fetchEpisodesComplete = (
  episodes: RemoteEpisode[],
  pageInfo: PageInfo
): FetchEpisodesComplete => ({
  type: episodeActions.FETCH_EPISODES_COMPLETE,
  payload: { episodes, pageInfo },
});

export const fetchEpisodesByIdComplete = (
  episodes: RemoteEpisode[]
): FetchEpisodesByIdComplete => ({
  type: episodeActions.FETCH_EPISODES_BY_ID_COMPLETE,
  payload: { episodes },
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
  | FetchEpisodesRequested
  | FetchEpisodesByIdComplete
  | FetchEpisodesComplete
  | FetchEpisodesFailure
  | FetchEpisodeRequested
  | FetchEpisodeComplete
  | FetchEpisodeFailure
  | UpdateEpisodeComplete
  | UpdateEpisodeRequested
  | DetailsOpened
  | DetailsClosed;

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
