import { forEach } from "lodash";
import { RemoteFeed } from "../../types/feed";
import { RemoteData } from "../remoteData";
import { feedActions, FeedsAction } from "./actions";

export interface State {
  [key: string]: RemoteData<RemoteFeed>;
}

const initialState: State = {};

const feeds = (state: State = initialState, action: FeedsAction): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_START:
      return state;
    case feedActions.FETCH_FEEDS_COMPLETE: {
      const remoteFeeds: { [key: string]: RemoteData<RemoteFeed> } = {};
      forEach(action.payload.feeds, feed => {
        remoteFeeds[feed.id] = { type: "SUCCESS", data: feed };
      });
      return {
        ...state,
        ...remoteFeeds
      };
    }
    default:
      return state;
  }
};

export default feeds;
