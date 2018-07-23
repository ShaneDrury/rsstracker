import { createSelector } from "reselect";
import { RemoteEpisode } from "../../types/episode";
import { getFeedId } from "../feeds/selectors";
import { RootState } from "../reducers";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteEpisode } => state.episodes.items;

export const getFetchStatus = (state: RootState) => state.episodes.fetchStatus;

export const getSortedEpisodeIds = (state: RootState): string[] =>
  state.episodes.ids;

export const getLoadedEpisodes = createSelector(
  getEpisodes,
  getSortedEpisodeIds,
  (remoteEpisodes, episodeIds): RemoteEpisode[] =>
    episodeIds.map(episodeId => remoteEpisodes[episodeId])
);

export const getPageInfo = (state: RootState) => state.episodes.pageInfo;

export const getStatus = (state: RootState) => state.episodes.status;

export const getSearchTerm = (state: RootState) => state.episodes.searchTerm;

export const getQueryParams = createSelector(
  getFeedId,
  getSearchTerm,
  getStatus,
  getPageInfo,
  (feedId, searchTerm, status, pageInfo) => {
    return {
      status,
      feedId,
      searchTerm,
      currentPage: pageInfo.currentPage,
    };
  }
);

export const getAllStatusCounts = (state: RootState) =>
  state.episodes.statusCounts;
