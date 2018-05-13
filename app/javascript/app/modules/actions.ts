import { RouterAction } from "react-router-redux";
import { EpisodesAction } from "./episodes/actions";
import { FeedJobsAction } from "./feedJobs/actions";
import { FeedsAction } from "./feeds/actions";
import { JobsAction } from "./jobs/actions";

export type RootAction =
  | FeedsAction
  | FeedJobsAction
  | EpisodesAction
  | RouterAction
  | JobsAction;
