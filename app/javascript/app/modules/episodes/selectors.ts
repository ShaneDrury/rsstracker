import { RemoteEpisode } from "../../types/episode";
import { RootState } from "../reducers";
import { RemoteData } from "../remoteData";

export const getEpisodes = (
  state: RootState
): { [key: string]: RemoteData<RemoteEpisode> } => state.episodes.items;
