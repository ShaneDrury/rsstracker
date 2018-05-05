import { forEach } from "lodash";
import { RemoteFeed } from "../../types/feed";
import { FetchStatus } from "../remoteData";
import { feedActions, FeedsAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteFeed;
  };
  fetchStatus: FetchStatus;
}

const initialState: State = { fetchStatus: "NOT_ASKED", items: {} };

const feeds = (state: State = initialState, action: FeedsAction): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_START:
      return {
        ...state,
        fetchStatus: "LOADING"
      };
    case feedActions.FETCH_FEEDS_COMPLETE: {
      const remoteFeeds: { [key: string]: RemoteFeed } = {};
      forEach(action.payload.feeds, feed => {
        remoteFeeds[feed.id] = feed;
      });
      return {
        ...state,
        items: {
          ...state.items,
          ...remoteFeeds
        },
        fetchStatus: "SUCCESS"
      };
    }
    default:
      return state;
  }
};

export default feeds;
