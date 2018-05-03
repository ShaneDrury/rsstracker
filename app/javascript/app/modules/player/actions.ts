export enum actions {
  UPDATE_PLAYED_SECONDS = "UPDATE_PLAYED_SECONDS",
  TOGGLE_PLAY = "TOGGLE_PLAY"
}

interface UpdatePlayedSeconds {
  type: actions.UPDATE_PLAYED_SECONDS;
  payload: { playedSeconds: number; episodeId: number };
}

interface TogglePlay {
  type: actions.TOGGLE_PLAY;
  payload: { playingEpisodeId: number };
}

export type Action = UpdatePlayedSeconds | TogglePlay;

export const updatePlayedSeconds = (
  episodeId: number,
  playedSeconds: number
): UpdatePlayedSeconds => ({
  type: actions.UPDATE_PLAYED_SECONDS,
  payload: { playedSeconds, episodeId }
});

export const togglePlay = (playingEpisodeId: number): TogglePlay => ({
  type: actions.TOGGLE_PLAY,
  payload: { playingEpisodeId }
});
