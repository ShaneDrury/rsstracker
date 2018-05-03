export enum actions {
  UPDATE_PLAYED_SECONDS = "UPDATE_PLAYED_SECONDS",
  TOGGLE_PLAY = "TOGGLE_PLAY"
}

interface UpdatePlayedSeconds {
  type: actions.UPDATE_PLAYED_SECONDS;
  payload: { playedSeconds: number };
}

interface TogglePlay {
  type: actions.TOGGLE_PLAY;
  payload: { episodeId: number };
}

export type Action = UpdatePlayedSeconds | TogglePlay;

export const updatePlayedSeconds = (
  playedSeconds: number
): UpdatePlayedSeconds => ({
  type: actions.UPDATE_PLAYED_SECONDS,
  payload: { playedSeconds }
});

export const togglePlay = (episodeId: number): TogglePlay => ({
  type: actions.TOGGLE_PLAY,
  payload: { episodeId }
});
