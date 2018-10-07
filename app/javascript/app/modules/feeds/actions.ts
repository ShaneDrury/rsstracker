import { RemoteFeed, StatusCounts } from "../../types/feed";
import { RootThunk } from "../../types/thunk";
import { fetchFeeds } from "./sources";

export enum feedActions {
  FETCH_FEEDS_START = "FETCH_FEEDS_START",
  FETCH_FEEDS_COMPLETE = "FETCH_FEEDS_COMPLETE",
  FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE",
  FETCH_FEED_REQUESTED = "FETCH_FEED_REQUESTED",
  FETCH_FEED_COMPLETE = "FETCH_FEED_COMPLETE",
}

interface FetchFeedsStart {
  type: feedActions.FETCH_FEEDS_START;
}

export interface FetchFeedRequested {
  type: feedActions.FETCH_FEED_REQUESTED;
  payload: { feedId: string };
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

export const fetchFeedRequested = (feedId: string): FetchFeedRequested => ({
  type: feedActions.FETCH_FEED_REQUESTED,
  payload: { feedId },
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

export const fetchFeedsAction = (): RootThunk<void> => async dispatch => {
  dispatch(fetchFeedsStart());
  try {
    const { items, statusCounts } = await fetchFeeds();
    dispatch(fetchFeedsComplete(items, statusCounts));
  } catch (err) {
    dispatch(fetchFeedsFailure(err));
  }
};

export type FeedsAction =
  | FetchFeedsStart
  | FetchFeedRequested
  | FetchFeedsComplete
  | FetchFeedsFailure
  | FetchFeedComplete;
