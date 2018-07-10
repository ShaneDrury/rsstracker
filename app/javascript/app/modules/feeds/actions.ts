import { RemoteFeed, StatusCounts } from "../../types/feed";
import { RootThunk } from "../../types/thunk";
import {
  fetchFeed,
  fetchFeeds,
  setFeedAutodownload as setFeedAutodownloadSource,
  setFeedDisabled as setFeedDisabledSource,
} from "./sources";

export enum feedActions {
  FETCH_FEEDS_START = "FETCH_FEEDS_START",
  FETCH_FEEDS_COMPLETE = "FETCH_FEEDS_COMPLETE",
  FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE",
  FETCH_FEED_COMPLETE = "FETCH_FEED_COMPLETE",
  SET_FEED_DISABLED_REQUESTED = "SET_FEED_DISABLED_REQUESTED",
  SET_FEED_DISABLED_COMPLETE = "SET_FEED_DISABLED_COMPLETE",
  SET_FEED_AUTODOWNLOAD_REQUESTED = "SET_FEED_AUTODOWNLOAD_REQUESTED",
  SET_FEED_AUTODOWNLOAD_COMPLETE = "SET_FEED_AUTODOWNLOAD_COMPLETE",
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

interface SetFeedDisabledRequested {
  type: feedActions.SET_FEED_DISABLED_REQUESTED;
  payload: {
    feedId: number;
    disabled: boolean;
  };
}

const setFeedDisabledRequested = (
  feedId: number,
  disabled: boolean
): SetFeedDisabledRequested => ({
  type: feedActions.SET_FEED_DISABLED_REQUESTED,
  payload: { feedId, disabled },
});

interface SetFeedDisabledComplete {
  type: feedActions.SET_FEED_DISABLED_COMPLETE;
  payload: {
    feedId: number;
  };
}

const setFeedDisabledComplete = (feedId: number): SetFeedDisabledComplete => ({
  type: feedActions.SET_FEED_DISABLED_COMPLETE,
  payload: { feedId },
});

interface SetFeedAutodownloadRequested {
  type: feedActions.SET_FEED_AUTODOWNLOAD_REQUESTED;
  payload: {
    feedId: number;
    autodownload: boolean;
  };
}

const setFeedAutodownloadRequested = (
  feedId: number,
  autodownload: boolean
): SetFeedAutodownloadRequested => ({
  type: feedActions.SET_FEED_AUTODOWNLOAD_REQUESTED,
  payload: { feedId, autodownload },
});

interface SetFeedAutodownloadComplete {
  type: feedActions.SET_FEED_AUTODOWNLOAD_COMPLETE;
  payload: {
    feedId: number;
  };
}

const setFeedAutodownloadComplete = (
  feedId: number
): SetFeedAutodownloadComplete => ({
  type: feedActions.SET_FEED_AUTODOWNLOAD_COMPLETE,
  payload: { feedId },
});

export const setFeedDisabled = (
  feedId: number,
  disabled: boolean
): RootThunk<void> => async dispatch => {
  dispatch(setFeedDisabledRequested(feedId, disabled));
  await setFeedDisabledSource(feedId, disabled);
  dispatch(setFeedDisabledComplete(feedId));
};

export const setFeedAutodownload = (
  feedId: number,
  autodownload: boolean
): RootThunk<void> => async dispatch => {
  dispatch(setFeedAutodownloadRequested(feedId, autodownload));
  await setFeedAutodownloadSource(feedId, autodownload);
  dispatch(setFeedAutodownloadComplete(feedId));
};

export type FeedsAction =
  | FetchFeedsStart
  | FetchFeedsComplete
  | FetchFeedsFailure
  | FetchFeedComplete
  | SetFeedDisabledRequested
  | SetFeedDisabledComplete
  | SetFeedAutodownloadRequested
  | SetFeedAutodownloadComplete;
