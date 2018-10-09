import { RemoteEpisode } from "../../types/episode";
import { RootState } from "../reducers";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteEpisode } => state.episodes.items;

export const getFetchStatus = (state: RootState) => state.episodes.fetchStatus;

export const getSortedEpisodeIds = (state: RootState): string[] =>
  state.episodes.ids;

export const getPageInfo = (state: RootState) => state.episodes.pageInfo;

export const getAllStatusCounts = (state: RootState) =>
  state.episodes.statusCounts;

export const getDetailEpisodeId = (state: RootState) =>
  state.episodes.detailEpisodeId;
