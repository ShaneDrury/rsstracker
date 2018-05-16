import camelcaseKeys from "camelcase-keys";
import { RemoteFeed, StatusKey } from "../../types/feed";
import { ApiJob } from "../../types/job";
import { RootThunk } from "../../types/thunk";
import { updateFeedStart } from "../feedJobs/actions";
import { fetchJobsComplete } from "../jobs/actions";
import { processJobResponse } from "../jobs/sources";
import { getSortedFeedIds } from "./selectors";
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
    statusCounts: { [key in StatusKey]?: number };
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
  statusCounts: { [key in StatusKey]?: number }
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
  const updateResponse: { job: ApiJob } = camelcaseKeys(
    await updateFeed(feedId),
    {
      deep: true,
    }
  );
  const job = processJobResponse(updateResponse.job);
  dispatch(updateFeedStart(job.providerJobId, feedId));
  dispatch(fetchJobsComplete([job]));
};

export const updateFeedsAction = (): RootThunk<void> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const feedIds = getSortedFeedIds(state);
  const updateResponse = await updateFeeds(feedIds);
  const jobs = updateResponse.jobs.map(processJobResponse);
  jobs.forEach((job, idx) => {
    const feedId = feedIds[idx];
    dispatch(updateFeedStart(job.providerJobId, feedId));
  });
  dispatch(fetchJobsComplete(jobs));
};
