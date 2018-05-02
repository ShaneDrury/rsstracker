import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";

export interface RootState {
  episodes: EpisodesState;
  feeds: FeedsState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodes,
  feeds
});

export default rootReducer;
