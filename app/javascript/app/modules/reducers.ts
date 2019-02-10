import { combineReducers, Reducer } from "redux";
import { RootAction } from "./actions";
import episodeJobs, { State as EpisodeJobsState } from "./episodeJobs/reducers";
import episodes, { State as EpisodesState } from "./episodes/reducers";
import favourites, { State as FavouritesState } from "./favourites/reducers";
import feeds, { State as FeedsState } from "./feeds/reducers";
import jobs, { JobsState } from "./jobs/reducers";
import notifications, {
  State as NotificationsState,
} from "./notifications/reducers";
import player, { State as PlayerState } from "./player/reducers";
import sourceJobs, { State as SourceJobsState } from "./sourceJobs/reducers";
import sources, { State as SourcesState } from "./sources/reducers";

export interface RootState {
  episodeJobs: EpisodeJobsState;
  episodes: EpisodesState;
  feeds: FeedsState;
  notifications: NotificationsState;
  player: PlayerState;
  jobs: JobsState;
  favourites: FavouritesState;
  sources: SourcesState;
  sourceJobs: SourceJobsState;
}

const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  episodeJobs,
  episodes,
  favourites,
  feeds,
  jobs,
  notifications,
  player,
  sources,
  sourceJobs,
});

export default rootReducer;
