import camelcaseKeys from "camelcase-keys";
import { zipObject } from "lodash";
import { RemoteFeed, StatusCounts } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { updateFeedsStarted, updateFeedStarted } from "../feedJobs/actions";
import { processJobResponse } from "../jobs/sources";
import { fetchFeed, fetchFeeds, updateFeed, updateFeeds } from "./sources";

export enum feedActions {
  FETCH_FEEDS_START = "FETCH_FEEDS_START",
  FETCH_FEEDS_COMPLETE = "FETCH_FEEDS_COMPLETE",
  FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE",
  FETCH_FEED_COMPLETE = "FETCH_FEED_COMPLETE",
}

interface FetchFeedsStart {
  type: feedActions.FETCH_FEEDS_START;
}

interface FetchFeedsComplete {
  type: feedActions.FETCH_FEEDS_COMPLETE;
  payload: {
    feeds: RemoteFeed[];
    statusCounts: StatusCounts;
  };
}

interface FetchFeedsFailure {
  type: feedActions.FETCH_FEEDS_FAILURE;
  payload: {
    error: string;
  };
}

interface FetchFeedComplete {
  type: feedActions.FETCH_FEED_COMPLETE;
  payload: {
    feed: RemoteFeed;
  };
}

export const fetchFeedsStart = (): FetchFeedsStart => ({
  type: feedActions.FETCH_FEEDS_START,
});

export const fetchFeedsComplete = (
  feeds: RemoteFeed[],
  statusCounts: StatusCounts
): FetchFeedsComplete => ({
  type: feedActions.FETCH_FEEDS_COMPLETE,
  payload: { feeds, statusCounts },
});

export const fetchFeedsFailure = (error: string): FetchFeedsFailure => ({
  type: feedActions.FETCH_FEEDS_FAILURE,
  payload: { error },
});

export const fetchFeedComplete = (feed: RemoteFeed): FetchFeedComplete => ({
  type: feedActions.FETCH_FEED_COMPLETE,
  payload: { feed },
});

export type FeedsAction =
  | FetchFeedsStart
  | FetchFeedsComplete
  | FetchFeedsFailure
  | FetchFeedComplete;

export const fetchFeedsAction = (): RootThunk<void> => async dispatch => {
  dispatch(fetchFeedsStart());
  try {
    const { items, statusCounts } = await fetchFeeds();
    dispatch(fetchFeedsComplete(items, statusCounts));
  } catch (err) {
    dispatch(fetchFeedsFailure(err));
  }
};

export const fetchFeedAction = (
  feedId: string
): RootThunk<void> => async dispatch => {
  const feed = await fetchFeed(feedId);
  dispatch(fetchFeedComplete(feed));
};

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
