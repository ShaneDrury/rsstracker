export enum sourceJobsActions {
  UPDATE_SOURCE_STARTED = "UPDATE_SOURCE_STARTED",
  UPDATE_SOURCE_COMPLETE = "UPDATE_SOURCE_COMPLETE",
}

interface UpdateSourceComplete {
  type: sourceJobsActions.UPDATE_SOURCE_COMPLETE;
  payload: {
    sourceId: string;
  };
}

interface UpdateSourceStarted {
  type: sourceJobsActions.UPDATE_SOURCE_STARTED;
  payload: {
    sourceId: string;
  };
}

export const updateSourceStarted = (sourceId: string): UpdateSourceStarted => ({
  type: sourceJobsActions.UPDATE_SOURCE_STARTED,
  payload: { sourceId },
});

export const updateSourceComplete = (
  sourceId: string
): UpdateSourceComplete => ({
  type: sourceJobsActions.UPDATE_SOURCE_COMPLETE,
  payload: { sourceId },
});

export type SourceJobsAction = UpdateSourceStarted | UpdateSourceComplete;
