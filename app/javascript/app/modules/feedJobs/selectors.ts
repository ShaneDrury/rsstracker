import { intersection } from "lodash";
import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { getSourceJobs } from "../sourceJobs/selectors";
import { getFeeds } from "../feeds/selectors";

export const getFeedJobs = (state: RootState) => state.feedJobs.items;

export const getUpdatingFeeds = createSelector(
  getSourceJobs,
  getFeeds,
  (updatingSources, feeds) =>
    feeds
      .filter(
        feed =>
          intersection(
            updatingSources,
            feed.sources.map(source => source.id.toString())
          ).length >= 1
      )
      .map(feed => feed.id)
);
