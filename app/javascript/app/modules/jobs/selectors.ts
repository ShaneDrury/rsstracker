import { createSelector } from "reselect";
import { getEpisodes } from "../episodes/selectors";
import { getFeedObjects } from "../feeds/selectors";
import { RootState } from "../reducers";
import { mapJobToDescription } from "./descriptions";

const getJobItems = (state: RootState) => state.jobs.items;

const getJobIds = (state: RootState) => state.jobs.ids;

export const getJobs = createSelector(getJobItems, getJobIds, (jobs, ids) =>
  ids.map(id => jobs[id])
);

export const getJobDescriptions = createSelector(
  getEpisodes,
  getFeedObjects,
  getJobs,
  (episodes, feeds, jobs) =>
    jobs.map(job => mapJobToDescription(episodes, feeds, job))
);
