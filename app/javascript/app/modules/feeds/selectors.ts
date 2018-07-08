import { createSelector } from "reselect";
import { RemoteFeed } from "../../types/feed";
import { getLocation } from "../location/selectors";
import { RootState } from "../reducers";

export const getSortedFeedIds = (state: RootState): number[] => state.feeds.ids;

export const getFeedObjects = (
  state: RootState
): { [key: string]: RemoteFeed } => state.feeds.items;

export const getFeeds = createSelector(
  getFeedObjects,
  getSortedFeedIds,
  (feeds, feedIds): RemoteFeed[] => feedIds.map(feedId => feeds[feedId])
);

export const getFetchStatus = (state: RootState) => state.feeds.fetchStatus;

export const getFeedId = createSelector(getLocation, location => {
  if (!location || location.pathname === "/") {
    return undefined;
  }
  return parseInt(location.pathname.substring(1), 10);
});

export const getEnabledFeedIds = createSelector(getFeeds, feeds =>
  feeds.filter(feed => !feed.disabled).map(feed => feed.id)
);
