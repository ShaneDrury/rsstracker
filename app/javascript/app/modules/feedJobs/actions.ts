import { zipObject } from "lodash";
import { RemoteFeed } from "../../types/feed";
import { RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { updateFeeds } from "../feeds/sources";
import { processJobResponse } from "../jobs/sources";

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
    feedsToJobs: { [feedId: string]: RemoteJob };
  };
}

interface UpdateFeedsRequested {
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED;
  payload: {
    feedIds: string[];
  };
}

export const updateFeedsRequested = (
  feedIds: string[]
): UpdateFeedsRequested => ({
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED,
  payload: { feedIds },
});

export const updateFeedsStarted = (feedsToJobs: {
  [feedId: string]: RemoteJob;
}): UpdateFeedsStarted => ({
  type: feedJobsActions.UPDATE_FEEDS_STARTED,
  payload: { feedsToJobs },
});

export const updateFeedsAction = (
  feedIds: string[]
): RootThunk<void> => async dispatch => {
  dispatch(updateFeedsRequested(feedIds));
  const updateResponse = await updateFeeds(feedIds);
  const jobs = updateResponse.jobs.map(processJobResponse);
  const feedsToJobs = zipObject(feedIds, jobs);
  dispatch(updateFeedsStarted(feedsToJobs));
};

export type FeedJobsAction =
  | UpdateFeedsStarted
  | UpdateFeedsRequested
  | UpdateFeedComplete;
