import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodeJobs, { State as EpisodeJobsState } from "./episodeJobs/reducers";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import feedJobs, { State as FeedJobsState } from "./feedJobs/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";
import jobs, { JobsState } from "./jobs/reducers";
import player, { State as PlayerState } from "./player/reducers";

export interface RootState {
  episodeJobs: EpisodeJobsState;
  episodes: EpisodesState;
  feeds: FeedsState;
  feedJobs: FeedJobsState;
  player: PlayerState;
  jobs: JobsState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodeJobs,
  episodes,
  feeds,
  feedJobs,
  jobs,
  player,
});

export default rootReducer;
