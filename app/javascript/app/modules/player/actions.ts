export enum actions {
  UPDATE_PLAYED_SECONDS = "UPDATE_PLAYED_SECONDS"
}

interface UpdatePlayedSeconds {
  type: actions.UPDATE_PLAYED_SECONDS;
  payload: { playedSeconds: number };
}

export const updatePlayedSeconds = (
  playedSeconds: number
): UpdatePlayedSeconds => ({
  type: actions.UPDATE_PLAYED_SECONDS,
  payload: { playedSeconds }
});

export type Action = UpdatePlayedSeconds;
