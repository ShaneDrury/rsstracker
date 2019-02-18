import { flatten } from "lodash";
import { createSelector } from "reselect";
import { isEpisodeJob, isFeedJob, isThumbnailJob } from "../../types/job";
import { getEpisodes } from "../episodes/selectors";
import { getFeedObjects } from "../feeds/selectors";
import { RootState } from "../reducers";
import { getSourceObjects } from "../sources/selectors";
import {
  episodeToJobDescription,
  feedToJobDescription,
  thumbnailJobToDescription,
} from "./descriptions";

const getJobItems = (state: RootState) => state.jobs.items;

const getJobIds = (state: RootState) => state.jobs.ids;

export const getJobs = createSelector(
  getJobItems,
  getJobIds,
  (jobs, ids) => ids.map(id => jobs[id])
);

export const getEpisodeJobs = createSelector(
  getJobs,
  jobs => jobs.filter(isEpisodeJob)
);

export const getFeedJobs = createSelector(
  getJobs,
  jobs => jobs.filter(isFeedJob)
);

export const getThumbnailJobs = createSelector(
  getJobs,
  jobs => jobs.filter(isThumbnailJob)
);

export const getEpisodeNotifications = createSelector(
  getEpisodes,
  getEpisodeJobs,
  (episodes, episodeJobs) =>
    episodeJobs.map(episodeJob => episodeToJobDescription(episodes, episodeJob))
);

export const getFeedNotifications = createSelector(
  getFeedObjects,
  getSourceObjects,
  getFeedJobs,
  (feeds, sources, feedJobs) =>
    flatten(
      feedJobs.map(feedJob => feedToJobDescription(feeds, sources, feedJob))
    )
);

export const getThumbnailNotifications = createSelector(
  getThumbnailJobs,
  thumbnailJobs => thumbnailJobs.map(thumbnailJobToDescription)
);

export const getJobDescriptions = createSelector(
  getEpisodeNotifications,
  getFeedNotifications,
  getThumbnailNotifications,
  (episodeNotifications, feedNotifications, thumbnailNotifications) => [
    ...episodeNotifications,
    ...feedNotifications,
    ...thumbnailNotifications,
  ]
);
