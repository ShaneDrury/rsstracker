import * as shortid from "shortid";
import { ApiFeed, FeedData, RemoteFeed } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import apiFetch from "../apiFetch";

export interface UpdateFeedsResponse {
  jobs: ProviderJob[];
}

export const processFeed = (feed: FeedData): RemoteFeed => ({
  ...feed.attributes,
  key: shortid.generate(),
  id: feed.id.toString(),
  sources: feed.relationships.allSources.data,
});

export const fetchFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  return feedsResponse.items.map(processFeed);
};

export const fetchFeed = async (feedId: string): Promise<RemoteFeed> => {
  const feedsResponse = await apiFetch(`/feeds/${feedId}`);
  const camel = feedsResponse as ApiFeed;
  return processFeed(camel.data);
};

export const updateFeeds = async (): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
  });
