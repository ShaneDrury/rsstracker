import { keys } from "lodash";
import { createSelector } from "reselect";
import { RootState } from "../reducers";

export const getFeedJobs = (state: RootState) => state.feedJobs.items;

export const getUpdatingFeeds = createSelector(getFeedJobs, feedJobs =>
  keys(feedJobs)
);
