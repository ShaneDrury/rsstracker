import { forEach } from "lodash";
import { RemoteFeed } from "../../types/feed";
import { episodeActions, EpisodesAction } from "../episodes/actions";
import { FetchStatus } from "../remoteData";
import { feedActions, FeedsAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteFeed;
  };
  ids: number[];
  fetchStatus: FetchStatus;
}

const initialState: State = {
  fetchStatus: "NOT_ASKED",
  items: {},
  ids: [],
};

const feeds = (
  state: State = initialState,
  action: FeedsAction | EpisodesAction
): State => {
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
    case episodeActions.UPDATE_EPISODE_COMPLETE: {
      const feedId = action.payload.episode.feedId;
      const newFeed = { ...state.items[feedId], stale: true };
      return {
        ...state,
        items: {
          ...state.items,
          [feedId]: newFeed,
        },
      };
    }
    default:
      return state;
  }
};

export default feeds;
