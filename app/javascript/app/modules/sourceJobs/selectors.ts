import { keys } from "lodash";
import { createSelector } from "reselect";
import { RootState } from "../reducers";

export const getSourceJobs = (state: RootState) => state.sourceJobs.items;

export const getUpdatingSources = createSelector(
  getSourceJobs,
  feedJobs => keys(feedJobs)
);
