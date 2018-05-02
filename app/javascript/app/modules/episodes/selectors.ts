import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { RootState } from "../reducers";
import { RemoteData } from "../remoteData";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteData<RemoteEpisode> } => state.episodes.items;

export const getFilter = (state: RootState): Filter => state.episodes.filter;
