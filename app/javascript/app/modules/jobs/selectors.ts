import { flatten, uniqBy } from "lodash";
import { createSelector } from "reselect";
import { isEpisodeJob, isFeedJob, isThumbnailJob } from "../../types/job";
import { getEpisodes } from "../episodes/selectors";
import { getFeedObjects } from "../feeds/selectors";
import { RootState } from "../reducers";
import { getSourceObjects } from "../sources/selectors";
import {
  episodeToJobDescription,
  feedToJobDescription,
  processJob,
  thumbnailJobToDescription,
} from "./descriptions";
import { getSourceJobs } from "../sourceJobs/selectors";

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
    episodeJobs.map(episodeJob =>
      episodeToJobDescription(episodes, processJob(episodeJob))
    )
);

export const getFeedNotifications = createSelector(
  getFeedObjects,
  getSourceObjects,
  getFeedJobs,
  getSourceJobs,
  (feeds, sources, feedJobs, sourceJobs) => {
    const notifications = flatten(
      sourceJobs.map(sourceJob =>
        feedToJobDescription(feeds, sources, sourceJob)
      )
    );
    return uniqBy(notifications, notification => notification.description);
  }
);

export const getThumbnailNotifications = createSelector(
  getThumbnailJobs,
  thumbnailJobs =>
    thumbnailJobs.map(job => thumbnailJobToDescription(processJob(job)))
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
