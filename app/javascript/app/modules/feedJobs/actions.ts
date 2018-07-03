import camelcaseKeys from "camelcase-keys";
import { zipObject } from "lodash";
import { RemoteFeed } from "../../types/feed";
import { ProviderJob, RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { updateFeed, updateFeeds } from "../feeds/sources";
import { processJobResponse } from "../jobs/sources";

export enum feedJobsActions {
  UPDATE_FEED_STARTED = "UPDATE_FEED_STARTED",
  UPDATE_FEEDS_STARTED = "UPDATE_FEEDS_STARTED",
  UPDATE_FEED_REQUESTED = "UPDATE_FEED_REQUESTED",
  UPDATE_FEEDS_REQUESTED = "UPDATE_FEEDS_REQUESTED",
  UPDATE_FEED_COMPLETE = "UPDATE_FEED_COMPLETE",
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
    feedsToJobs: { [feedId: number]: RemoteJob };
  };
}

interface UpdateFeedRequested {
  type: feedJobsActions.UPDATE_FEED_REQUESTED;
  payload: {
    feedId: number;
  };
}

export const updateFeedRequested = (feedId: number): UpdateFeedRequested => ({
  type: feedJobsActions.UPDATE_FEED_REQUESTED,
  payload: { feedId },
});

interface UpdateFeedsRequested {
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED;
  payload: {
    feedIds: number[];
  };
}

export const updateFeedsRequested = (
  feedIds: number[]
): UpdateFeedsRequested => ({
  type: feedJobsActions.UPDATE_FEEDS_REQUESTED,
  payload: { feedIds },
});

export const updateFeedsStarted = (feedsToJobs: {
  [feedId: number]: RemoteJob;
}): UpdateFeedsStarted => ({
  type: feedJobsActions.UPDATE_FEEDS_STARTED,
  payload: { feedsToJobs },
});

export const updateFeedAction = (
  feedId: number
): RootThunk<void> => async dispatch => {
  dispatch(updateFeedRequested(feedId));
  const updateResponse: { job: ProviderJob } = camelcaseKeys(
    await updateFeed(feedId),
    {
      deep: true,
    }
  );
  const job = processJobResponse(updateResponse.job);
  dispatch(updateFeedStarted(feedId, job));
};

export const updateFeedsAction = (
  feedIds: number[]
): RootThunk<void> => async dispatch => {
  dispatch(updateFeedsRequested(feedIds));
  const updateResponse = await updateFeeds(feedIds);
  const jobs = updateResponse.jobs.map(processJobResponse);
  const feedsToJobs = zipObject(feedIds, jobs);
  dispatch(updateFeedsStarted(feedsToJobs));
};

export type FeedJobsAction =
  | UpdateFeedStarted
  | UpdateFeedsStarted
  | UpdateFeedRequested
  | UpdateFeedsRequested
  | UpdateFeedComplete;
