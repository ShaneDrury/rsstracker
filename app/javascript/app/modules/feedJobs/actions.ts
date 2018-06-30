import { RemoteJob } from "../../types/job";

export enum feedJobsActions {
  UPDATE_FEED_STARTED = "UPDATE_FEED_STARTED",
  UPDATE_FEEDS_STARTED = "UPDATE_FEEDS_STARTED",
}

interface UpdateFeedStarted {
  type: feedJobsActions.UPDATE_FEED_STARTED;
  payload: {
    job: RemoteJob;
    feedId: number;
  };
}

export const updateFeedStarted = (
  feedId: number,
  job: RemoteJob
): UpdateFeedStarted => ({
  type: feedJobsActions.UPDATE_FEED_STARTED,
  payload: { job, feedId },
});

interface UpdateFeedsStarted {
  type: feedJobsActions.UPDATE_FEEDS_STARTED;
  payload: {
    feedsToJobs: { [feedId: number]: RemoteJob };
  };
}

export const updateFeedsStarted = (feedsToJobs: {
  [feedId: number]: RemoteJob;
}): UpdateFeedsStarted => ({
  type: feedJobsActions.UPDATE_FEEDS_STARTED,
  payload: { feedsToJobs },
});

export type FeedJobsAction = UpdateFeedStarted | UpdateFeedsStarted;
