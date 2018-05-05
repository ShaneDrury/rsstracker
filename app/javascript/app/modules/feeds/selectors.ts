import { createSelector } from "reselect";
import { RemoteFeed } from "../../types/feed";
import { RootState } from "../reducers";

export const getFeeds = (state: RootState): { [key: string]: RemoteFeed } =>
  state.feeds.items;

export const getFeedsList = createSelector(getFeeds, feeds =>
  Object.values(feeds)
);

export const getFetchStatus = (state: RootState) => state.feeds.fetchStatus;
