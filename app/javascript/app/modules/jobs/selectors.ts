import { createSelector } from "reselect";
import { RootState } from "../reducers";

const getJobItems = (state: RootState) => state.jobs.items;

const getJobIds = (state: RootState) => state.jobs.ids;

export const getJobs = createSelector(getJobItems, getJobIds, (jobs, ids) =>
  ids.map(id => jobs[id])
);
