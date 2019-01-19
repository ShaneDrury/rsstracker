import { RemoteFeed } from "../../types/feed";
import { FeedJobsAction, feedJobsActions } from "../feedJobs/actions";
import { FetchStatus, normalize } from "../remoteData";
import { feedActions, FeedsAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteFeed;
  };
  ids: string[];
  fetchStatus: FetchStatus;
}

const initialState: State = {
  fetchStatus: "NOT_ASKED",
  items: {},
  ids: [],
};

const feeds = (
  state: State = initialState,
  action: FeedsAction | FeedJobsAction
): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_REQUESTED:
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    case feedActions.FETCH_FEEDS_COMPLETE: {
      const { ids, items } = normalize(action.payload.feeds);
      return {
        ...state,
        ids,
        items: {
          ...state.items,
          ...items,
        },
        fetchStatus: "SUCCESS",
      };
    }
    case feedJobsActions.UPDATE_FEED_COMPLETE:
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
