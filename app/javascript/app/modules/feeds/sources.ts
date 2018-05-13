import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed } from "../../types/feed";
import { ApiJob } from "../../types/job";
import apiFetch from "../apiFetch";

interface UpdateFeedsResponse {
  jobs: ApiJob[];
}

interface UpdateFeedResponse {
  job: ApiJob;
}

export const processFeed = (feed: ApiFeed): RemoteFeed => ({
  ...feed,
  key: shortid.generate(),
});

export const fetchFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  const camel = camelcaseKeys(feedsResponse, { deep: true });
  return camel.map(processFeed);
};

export const updateFeed = async (feedId: number): Promise<UpdateFeedResponse> =>
  apiFetch(`/feeds/${feedId}/update_feed`, { method: "POST" });

export const updateFeeds = async (
  feedIds: number[]
): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
    body: JSON.stringify({ feed_ids: feedIds }),
  });
