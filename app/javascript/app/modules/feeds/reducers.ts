import { forEach } from "lodash";
import { RemoteFeed, StatusCounts } from "../../types/feed";
import { FetchStatus } from "../remoteData";
import { feedActions, FeedsAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteFeed;
  };
  ids: number[];
  fetchStatus: FetchStatus;
  statusCounts: StatusCounts;
}

const initialState: State = {
  fetchStatus: "NOT_ASKED",
  items: {},
  ids: [],
  statusCounts: {},
};

const feeds = (state: State = initialState, action: FeedsAction): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_START:
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    case feedActions.FETCH_FEEDS_COMPLETE: {
      const remoteFeeds: { [key: string]: RemoteFeed } = {};
      const ids: number[] = [];
      forEach(action.payload.feeds, feed => {
        remoteFeeds[feed.id] = feed;
        ids.push(feed.id);
      });
      return {
        ...state,
        ids,
        items: {
          ...state.items,
          ...remoteFeeds,
        },
        fetchStatus: "SUCCESS",
        statusCounts: action.payload.statusCounts,
      };
    }
    case feedActions.FETCH_FEED_COMPLETE: {
      const updatedFeed = action.payload.feed;
      return {
        ...state,
        items: {
          ...state.items,
          [updatedFeed.id]: updatedFeed,
        },
      };
    }
    default:
      return state;
  }
};

export default feeds;
