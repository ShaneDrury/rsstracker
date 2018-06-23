import { RouterAction } from "react-router-redux";
import { EpisodeJobsAction } from "./episodeJobs/actions";
import { EpisodesAction } from "./episodes/actions";
import { FeedJobsAction } from "./feedJobs/actions";
import { FeedsAction } from "./feeds/actions";
import { JobsAction } from "./jobs/actions";
import { StatusCountsAction } from "./statusCounts/actions";

export type RootAction =
  | FeedsAction
  | FeedJobsAction
  | EpisodeJobsAction
  | EpisodesAction
  | RouterAction
  | JobsAction
  | StatusCountsAction;
