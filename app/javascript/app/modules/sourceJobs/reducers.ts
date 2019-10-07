import { without, union } from "lodash";
import { SourceJobsAction, sourceJobsActions } from "./actions";

export interface State {
  items: string[];
}

const initialState: State = { items: [] };

const sourceJobs = (
  state: State = initialState,
  action: SourceJobsAction
): State => {
  switch (action.type) {
    case sourceJobsActions.UPDATE_SOURCE_STARTED: {
      const sourceId = action.payload.sourceId;
      return {
        ...state,
        items: union(state.items, [sourceId]),
      };
    }
    case sourceJobsActions.UPDATE_SOURCE_COMPLETE: {
      const sourceId = action.payload.sourceId;
      return {
        ...state,
        items: without(state.items, sourceId),
      };
    }
    default:
      return state;
  }
};

export default sourceJobs;
