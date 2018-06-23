import { StatusCounts } from "../../types/feed";
import { statusActions, StatusCountsAction } from "./actions";

export interface State {
  items: StatusCounts;
}

const initialState: State = {
  items: {
    all: 0,
  },
};

const feeds = (
  state: State = initialState,
  action: StatusCountsAction
): State => {
  switch (action.type) {
    case statusActions.FETCH_STATUSES_COMPLETE: {
      return {
        ...state,
        items: action.payload.statusCounts,
      };
    }
    default:
      return state;
  }
};

export default feeds;
