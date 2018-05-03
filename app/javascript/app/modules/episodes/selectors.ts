import { mapValues, pickBy } from "lodash";
import { createSelector } from "reselect";
import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { RootState } from "../reducers";
import { RemoteData, Success } from "../remoteData";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteData<RemoteEpisode> } => state.episodes.items;

export const getFilter = (state: RootState): Filter => state.episodes.filter;

export const getLoadedEpisodes = createSelector(getEpisodes, (remoteEpisodes): {
  [key: string]: RemoteEpisode;
} => {
  const successRemotes = pickBy(
    remoteEpisodes,
    remoteEpisode => remoteEpisode.type === "SUCCESS"
  ) as { [key: string]: Success<RemoteEpisode> };
  return mapValues(successRemotes, remoteEpisode => remoteEpisode.data);
});
