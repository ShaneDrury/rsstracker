import camelcaseKeys from "camelcase-keys";
import { zipObject } from "lodash";
import { ProviderJob, RemoteJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { updateFeed, updateFeeds } from "../feeds/sources";
import { processJobResponse } from "../jobs/sources";

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

export const updateFeedAction = (
  feedId: number
): RootThunk<void> => async dispatch => {
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
  const updateResponse = await updateFeeds(feedIds);
  const jobs = updateResponse.jobs.map(processJobResponse);
  const feedsToJobs = zipObject(feedIds, jobs);
  dispatch(updateFeedsStarted(feedsToJobs));
};

export type FeedJobsAction = UpdateFeedStarted | UpdateFeedsStarted;
