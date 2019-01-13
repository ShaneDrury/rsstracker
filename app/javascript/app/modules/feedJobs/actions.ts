import { RemoteFeed } from "../../types/feed";
import { RemoteJob } from "../../types/job";

export enum feedJobsActions {
  UPDATE_FEEDS_STARTED = "UPDATE_FEEDS_STARTED",
  UPDATE_FEEDS_REQUESTED = "UPDATE_FEEDS_REQUESTED",
  UPDATE_FEED_COMPLETE = "UPDATE_FEED_COMPLETE",
}

interface UpdateFeedComplete {
  type: feedJobsActions.UPDATE_FEED_COMPLETE;
  payload: {
    feed: RemoteFeed;
  };
}

export const updateFeedComplete = (feed: RemoteFeed): UpdateFeedComplete => ({
  type: feedJobsActions.UPDATE_FEED_COMPLETE,
  payload: { feed },
});

interface UpdateFeedsStarted {
  type: feedJobsActions.UPDATE_FEEDS_STARTED;
  payload: {
    sourcesToJobs: { [sourceId: string]: RemoteJob };
  };
}

export interface UpdateFeedsRequested {
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED;
}

export const updateFeedsRequested = (): UpdateFeedsRequested => ({
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED,
});

export const updateFeedsStarted = (sourcesToJobs: {
  [sourceId: string]: RemoteJob;
}): UpdateFeedsStarted => ({
  type: feedJobsActions.UPDATE_FEEDS_STARTED,
  payload: { sourcesToJobs },
});

export type FeedJobsAction =
  | UpdateFeedsStarted
  | UpdateFeedsRequested
  | UpdateFeedComplete;
