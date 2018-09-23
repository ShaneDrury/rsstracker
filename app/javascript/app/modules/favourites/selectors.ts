import { createSelector } from "reselect";
import { RemoteEpisode } from "../../types/episode";
import { getEpisodes } from "../episodes/selectors";
import { RootState } from "../reducers";

export const getFavouritesIds = (state: RootState) =>
  state.favourites.episodeIds;

export const getFavourites = createSelector(
  getEpisodes,
  getFavouritesIds,
  (remoteEpisodes, episodeIds): RemoteEpisode[] =>
    episodeIds.map(episodeId => remoteEpisodes[episodeId])
);
