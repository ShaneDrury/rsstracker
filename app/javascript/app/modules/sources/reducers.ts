import { forEach } from "lodash";
import { Source } from "../../types/feed";
import { FeedJobsAction, feedJobsActions } from "../feedJobs/actions";
import { feedActions, FeedsAction } from "../feeds/actions";

export interface State {
  items: {
    [key: string]: Source;
  };
  ids: string[];
}

const initialState: State = {
  items: {},
  ids: [],
};

const feeds = (
  state: State = initialState,
  action: FeedsAction | FeedJobsAction
): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_COMPLETE: {
      const sources: { [key: string]: Source } = {};
      const ids: string[] = [];
      forEach(action.payload.feeds, feed => {
        forEach(feed.sources, source => {
          sources[source.id] = source;
          ids.push(source.id.toString());
        });
      });
      return {
        ...state,
        ids,
        items: {
          ...state.items,
          ...sources,
        },
      };
    }
    case feedJobsActions.UPDATE_FEED_COMPLETE:
    case feedActions.FETCH_FEED_COMPLETE: {
      const sources: { [key: string]: Source } = {};
      const ids: string[] = [];
      forEach(action.payload.feed.sources, source => {
        sources[source.id] = source;
        ids.push(source.id.toString());
      });
      return {
        ...state,
        ids,
        items: {
          ...state.items,
          ...sources,
        },
      };
    }
    default:
      return state;
  }
};

export default feeds;
