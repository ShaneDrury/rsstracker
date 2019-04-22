export enum actions {
  PLAYED_SECONDS_UPDATED = "PLAYED_SECONDS_UPDATED",
  PLAY_TOGGLED = "PLAY_TOGGLED",
  PLAYER_PAUSED = "PLAYER_PAUSED",
  PLAYER_RESUMED = "PLAYER_RESUMED",
  PLAYER_ENABLED = "PLAYER_ENABLED",
}

export interface PlayedSecondsUpdated {
  type: actions.PLAYED_SECONDS_UPDATED;
  payload: { playedSeconds: number; episodeId: string };
}

export interface PlayToggled {
  type: actions.PLAY_TOGGLED;
  payload: { playingEpisodeId: string };
}

interface PlayerPaused {
  type: actions.PLAYER_PAUSED;
}

interface PlayerResumed {
  type: actions.PLAYER_RESUMED;
}

interface PlayerEnabled {
  type: actions.PLAYER_ENABLED;
}

export type Action =
  | PlayedSecondsUpdated
  | PlayToggled
  | PlayerPaused
  | PlayerResumed
  | PlayerEnabled;

export const playedSecondsUpdated = (
  episodeId: string,
  playedSeconds: number
): PlayedSecondsUpdated => ({
  type: actions.PLAYED_SECONDS_UPDATED,
  payload: { playedSeconds, episodeId },
});

export const playToggled = (playingEpisodeId: string): PlayToggled => ({
  type: actions.PLAY_TOGGLED,
  payload: { playingEpisodeId },
});

export const playerPaused = () => ({
  type: actions.PLAYER_PAUSED,
});

export const playerResumed = () => ({
  type: actions.PLAYER_RESUMED,
});

export const playerEnabled = () => ({
  type: actions.PLAYER_ENABLED,
});
