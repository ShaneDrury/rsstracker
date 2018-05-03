import { RootState } from "../reducers";

export const getPlayingEpisode = (state: RootState) => state.player.episodeId;
