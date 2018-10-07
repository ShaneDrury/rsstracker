import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed, StatusCounts } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import apiFetch from "../apiFetch";

interface UpdateFeedsResponse {
  jobs: ProviderJob[];
}

interface UpdateFeedResponse {
  job: ProviderJob;
}

interface FeedsResponse {
  items: ApiFeed[];
  statusCounts: StatusCounts;
}

interface ProcessedFeeds {
  items: RemoteFeed[];
  statusCounts: StatusCounts;
}

export const processFeed = (feed: ApiFeed): RemoteFeed => ({
  ...feed,
  key: shortid.generate(),
  id: feed.id.toString(),
});

export const fetchFeeds = async (): Promise<ProcessedFeeds> => {
  const feedsResponse = await apiFetch("/feeds");
  const camel: FeedsResponse = camelcaseKeys(feedsResponse, { deep: true });
  return {
    items: camel.items.map(processFeed),
    statusCounts: camel.statusCounts,
  };
};

export const fetchFeed = async (feedId: string): Promise<RemoteFeed> => {
  const feedsResponse = await apiFetch(`/feeds/${feedId}`);
  const camel: ApiFeed = camelcaseKeys(feedsResponse, { deep: true });
  return processFeed(camel);
};

export const updateFeed = async (feedId: string): Promise<UpdateFeedResponse> =>
  apiFetch(`/feeds/${feedId}/update_feed`, { method: "POST" });

export const updateFeeds = async (
  feedIds: string[]
): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
    body: JSON.stringify({ feed_ids: feedIds }),
  });
