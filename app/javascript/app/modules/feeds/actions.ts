import { RemoteFeed } from "../../types/feed";
import { RemoteJob } from "../../types/job";

export enum feedActions {
  FETCH_FEEDS_REQUESTED = "FETCH_FEEDS_REQUESTED",
  FETCH_FEEDS_COMPLETE = "FETCH_FEEDS_COMPLETE",
  FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE",
  FETCH_FEED_REQUESTED = "FETCH_FEED_REQUESTED",
  FETCH_FEED_COMPLETE = "FETCH_FEED_COMPLETE",
  FEEDS_UPDATING = "FEEDS_UPDATING",
}

export interface FeedsUpdating {
  type: feedActions.FEEDS_UPDATING;
  payload: {
    feeds: RemoteFeed[];
    job: RemoteJob;
  };
}

export interface FetchFeedsRequested {
  type: feedActions.FETCH_FEEDS_REQUESTED;
}

export interface FetchFeedRequested {
  type: feedActions.FETCH_FEED_REQUESTED;
  payload: { feedId: string };
}

export interface FetchFeedsComplete {
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

export const fetchFeedsRequested = (): FetchFeedsRequested => ({
  type: feedActions.FETCH_FEEDS_REQUESTED,
});

export const fetchFeedRequested = (feedId: string): FetchFeedRequested => ({
  type: feedActions.FETCH_FEED_REQUESTED,
  payload: { feedId },
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

export const feedsUpdating = (
  feeds: RemoteFeed[],
  job: RemoteJob
): FeedsUpdating => ({
  type: feedActions.FEEDS_UPDATING,
  payload: { feeds, job },
});

export type FeedsAction =
  | FetchFeedsRequested
  | FetchFeedRequested
  | FetchFeedsComplete
  | FetchFeedsFailure
  | FetchFeedComplete
  | FeedsUpdating;
