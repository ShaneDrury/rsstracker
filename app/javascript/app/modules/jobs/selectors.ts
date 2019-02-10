import { createSelector } from "reselect";
import { isFeedJob } from "../../types/job";
import { getEpisodes } from "../episodes/selectors";
import { getNotifications } from "../notifications/selectors";
import { RootState } from "../reducers";
import { getSourceObjects } from "../sources/selectors";
import { mapJobToDescription } from "./descriptions";

const getJobItems = (state: RootState) => state.jobs.items;

const getJobIds = (state: RootState) => state.jobs.ids;

export const getJobs = createSelector(
  getJobItems,
  getJobIds,
  (jobs, ids) => ids.map(id => jobs[id])
);

export const getJobDescriptions = createSelector(
  getEpisodes,
  getSourceObjects,
  getNotifications,
  getJobs,
  (episodes, sources, notifications, jobs) => [
    ...jobs
      .filter(job => !isFeedJob(job))
      .map(job => mapJobToDescription(episodes, sources, job)),
    ...notifications,
  ]
);
