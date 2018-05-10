import { routerReducer, RouterState } from "react-router-redux";
import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";
import jobs, { JobsState } from "./jobs/reducers";
import player, { State as PlayerState } from "./player/reducers";

export interface RootState {
  episodes: EpisodesState;
  feeds: FeedsState;
  player: PlayerState;
  jobs: JobsState;
  routing: RouterState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodes,
  feeds,
  jobs,
  player,
  routing: routerReducer,
} as any);

export default rootReducer;
