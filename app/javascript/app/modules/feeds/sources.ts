import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import apiFetch from "../apiFetch";

export interface UpdateFeedsResponse {
  jobs: ProviderJob[];
}

interface FeedsResponse {
  items: ApiFeed[];
}
export const processFeed = (feed: ApiFeed): RemoteFeed => ({
  ...feed,
  key: shortid.generate(),
  id: feed.id.toString(),
});

export const fetchFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  const camel: FeedsResponse = camelcaseKeys(feedsResponse, { deep: true });
  return camel.items.map(processFeed);
};

export const fetchFeed = async (feedId: string): Promise<RemoteFeed> => {
  const feedsResponse = await apiFetch(`/feeds/${feedId}`);
  const camel: ApiFeed = camelcaseKeys(feedsResponse, { deep: true });
  return processFeed(camel);
};

export const updateFeeds = async (
  feedIds: string[]
): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
    body: JSON.stringify({ feed_ids: feedIds }),
  });
