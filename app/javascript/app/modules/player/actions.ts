export enum actions {
  PLAYED_SECONDS_UPDATED = "PLAYED_SECONDS_UPDATED",
  PLAY_TOGGLED = "PLAY_TOGGLED",
}

interface PlayedSecondsUpdated {
  type: actions.PLAYED_SECONDS_UPDATED;
  payload: { playedSeconds: number; episodeId: number };
}

interface PlayToggled {
  type: actions.PLAY_TOGGLED;
  payload: { playingEpisodeId: number };
}

export type Action = PlayedSecondsUpdated | PlayToggled;

export const playedSecondsUpdated = (
  episodeId: number,
  playedSeconds: number
): PlayedSecondsUpdated => ({
  type: actions.PLAYED_SECONDS_UPDATED,
  payload: { playedSeconds, episodeId },
});

export const playToggled = (playingEpisodeId: number): PlayToggled => ({
  type: actions.PLAY_TOGGLED,
  payload: { playingEpisodeId },
});
