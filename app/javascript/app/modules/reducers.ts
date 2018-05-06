import { routerReducer, RouterState } from "react-router-redux";
import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";
import player, { State as PlayerState } from "./player/reducers";

export interface RootState {
  episodes: EpisodesState;
  feeds: FeedsState;
  player: PlayerState;
  routing: RouterState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodes,
  feeds,
  player,
  routing: routerReducer,
} as any);

export default rootReducer;
