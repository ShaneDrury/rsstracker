import { EpisodeJobsAction } from "./episodeJobs/actions";
import { EpisodesAction } from "./episodes/actions";
import { FavouritesAction } from "./favourites/actions";
import { FeedJobsAction } from "./feedJobs/actions";
import { FeedsAction } from "./feeds/actions";
import { JobsAction } from "./jobs/actions";

export type RootAction =
  | FeedsAction
  | FeedJobsAction
  | EpisodeJobsAction
  | EpisodesAction
  | JobsAction
  | FavouritesAction;
