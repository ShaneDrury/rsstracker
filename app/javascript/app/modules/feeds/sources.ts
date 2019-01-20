import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import apiFetch from "../apiFetch";

export interface UpdateFeedsResponse {
  jobs: ProviderJob[];
}

export const processFeed = (feed: ApiFeed): RemoteFeed => ({
  ...camelcaseKeys(feed, { deep: true }),
  key: shortid.generate(),
  id: feed.id.toString(),
});

export const fetchFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  return feedsResponse.items.map(processFeed);
};

export const fetchFeed = async (feedId: string): Promise<RemoteFeed> => {
  const feedsResponse = await apiFetch(`/feeds/${feedId}`);
  const camel: ApiFeed = camelcaseKeys(feedsResponse, { deep: true });
  return processFeed(camel);
};

export const updateFeeds = async (): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
  });
