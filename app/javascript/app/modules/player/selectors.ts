import { RootState } from "../reducers";

export const getPlayingEpisode = (state: RootState) =>
  state.player.playingEpisodeId;

export const getPlayedSeconds = (state: RootState) => state.player.saved;
