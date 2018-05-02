import { routerReducer, RouterState } from "react-router-redux";
import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";

export interface RootState {
  episodes: EpisodesState;
  feeds: FeedsState;
  routing: RouterState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodes,
  feeds,
  routing: routerReducer
} as any);

export default rootReducer;
