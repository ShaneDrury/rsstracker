import { createSelector } from "reselect";
import { getEpisodes } from "../episodes/selectors";
import { RootState } from "../reducers";

export const getPlayingEpisodeId = (state: RootState) =>
  state.player.playingEpisodeId;

export const getPlayingEpisode = createSelector(
  getEpisodes,
  getPlayingEpisodeId,
  (episodes, playingEpisodeId) =>
    playingEpisodeId && episodes[playingEpisodeId]
      ? playingEpisodeId
      : undefined
);

export const getPlayedSeconds = (state: RootState) => state.player.saved;
