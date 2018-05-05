import { createSelector } from "reselect";
import * as shortid from "shortid";
import { RemoteFeed } from "../../types/feed";
import { RootState } from "../reducers";
import { RemoteData } from "../remoteData";

export const getFeeds = (
  state: RootState
): { [key: string]: RemoteData<RemoteFeed> } => state.feeds;

export const getFeedsList = createSelector(getFeeds, feeds =>
  Object.values(feeds).map(feed => ({ ...feed, key: shortid.generate() }))
);
