import { feedActions, FeedsAction } from "./actions";

export interface State {}

const feeds = (state: State = {}, action: FeedsAction): State => {
  switch (action.type) {
    case feedActions.FETCH_FEEDS_START:
      return state;
    default:
      return state;
  }
};

export default feeds;
