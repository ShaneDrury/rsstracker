import { RemoteFeed } from "../../types/feed";
import { RootThunk } from "../../types/thunk";
import { fetchJobsComplete } from "../jobs/actions";
import { processJobsResponse } from "../jobs/sources";
import { getFeeds, updateFeeds } from "./sources";

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
  feeds: RemoteFeed[]
): FetchFeedsComplete => ({
  type: feedActions.FETCH_FEEDS_COMPLETE,
  payload: { feeds },
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

export const fetchFeeds = (): RootThunk<void> => async dispatch => {
  dispatch(fetchFeedsStart());
  try {
    const feeds = await getFeeds();
    dispatch(fetchFeedsComplete(feeds));
  } catch (err) {
    dispatch(fetchFeedsFailure(err));
  }
};

export const updateFeedsAction = (): RootThunk<void> => async dispatch => {
  const updateResponse = await updateFeeds();
  const jobs = processJobsResponse(updateResponse.jobs);
  dispatch(fetchJobsComplete(jobs));
};
