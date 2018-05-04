import { createSelector } from "reselect";
import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { RootState } from "../reducers";
import { RemoteData, Success } from "../remoteData";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteData<RemoteEpisode> } => state.episodes.items;

export const getSortedEpisodeIds = (state: RootState): number[] =>
  state.episodes.ids;

export const getFilter = (state: RootState): Filter => state.episodes.filter;

export const getLoadedEpisodes = createSelector(
  getEpisodes,
  getSortedEpisodeIds,
  (remoteEpisodes, episodeIds): RemoteEpisode[] => {
    const sortedEpisodes = episodeIds.map(
      episodeId => remoteEpisodes[episodeId]
    );
    return sortedEpisodes
      .filter(episode => episode.type === "SUCCESS")
      .map(episode => (episode as Success<RemoteEpisode>).data);
  }
);
