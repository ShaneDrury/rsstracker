import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import feeds, { State as FeedsState } from "./feeds/reducers";

export interface RootState {
  feeds: FeedsState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  feeds
});

export default rootReducer;
