import { routerReducer, RouterState } from "react-router-redux";
import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodeJobs, { State as EpisodeJobsState } from "./episodeJobs/reducers";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feedJobs, { State as FeedJobsState } from "./feedJobs/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";
import jobs, { JobsState } from "./jobs/reducers";
import player, { State as PlayerState } from "./player/reducers";
import statusCounts, {
  State as StatusCountsState,
} from "./statusCounts/reducers";

export interface RootState {
  episodeJobs: EpisodeJobsState;
  episodes: EpisodesState;
  feeds: FeedsState;
  feedJobs: FeedJobsState;
  player: PlayerState;
  jobs: JobsState;
  routing: RouterState;
  statusCounts: StatusCountsState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodeJobs,
  episodes,
  feeds,
  feedJobs,
  jobs,
  player,
  routing: routerReducer,
  statusCounts,
} as any);

export default rootReducer;
