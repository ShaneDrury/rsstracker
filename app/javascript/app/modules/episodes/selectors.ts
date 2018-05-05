import { createSelector } from "reselect";
import { RemoteEpisode } from "../../types/episode";
import { RootState } from "../reducers";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteEpisode } => state.episodes.items;

export const getFetchStatus = (state: RootState) => state.episodes.fetchStatus;

export const getSortedEpisodeIds = (state: RootState): number[] =>
  state.episodes.ids;

export const getLoadedEpisodes = createSelector(
  getEpisodes,
  getSortedEpisodeIds,
  (remoteEpisodes, episodeIds): RemoteEpisode[] =>
    episodeIds.map(episodeId => remoteEpisodes[episodeId])
);
