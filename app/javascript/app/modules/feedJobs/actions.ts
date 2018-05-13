export enum feedJobsActions {
  UPDATE_FEED_START = "UPDATE_FEED_START",
}

interface UpdateFeedStart {
  type: feedJobsActions.UPDATE_FEED_START;
  payload: {
    jobId: number;
    feedId: number;
  };
}

export const updateFeedStart = (
  jobId: number,
  feedId: number
): UpdateFeedStart => ({
  type: feedJobsActions.UPDATE_FEED_START,
  payload: { jobId, feedId },
});

export type FeedJobsAction = UpdateFeedStart;
