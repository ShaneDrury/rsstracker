import { createSelector } from "reselect";
import { RemoteFeed } from "../../types/feed";
import { RootState } from "../reducers";

export const getSortedFeedIds = (state: RootState): string[] => state.feeds.ids;

export const getFeedObjects = (
  state: RootState
): { [key: string]: RemoteFeed } => state.feeds.items;

export const getFeeds = createSelector(
  getFeedObjects,
  getSortedFeedIds,
  (feeds, feedIds): RemoteFeed[] => feedIds.map(feedId => feeds[feedId])
);

export const getFetchStatus = (state: RootState) => state.feeds.fetchStatus;

export const getEnabledFeedIds = createSelector(getFeeds, feeds =>
  feeds.filter(feed => !feed.disabled).map(feed => feed.id)
);
