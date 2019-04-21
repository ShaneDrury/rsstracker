import * as shortid from "shortid";
import { ApiFeed, FeedData, RemoteFeed } from "../../types/feed";
import { ProviderJobs } from "../../types/job";
import apiFetch from "../apiFetch";

export type UpdateFeedsResponse = ProviderJobs;

export const processFeed = (feed: FeedData): RemoteFeed => ({
  ...feed.attributes,
  key: shortid.generate(),
  id: feed.id.toString(),
  sources: feed.relationships.allSources.data,
});

export const fetchFeed = async (feedId: string): Promise<RemoteFeed> => {
  const feedsResponse: ApiFeed = await apiFetch(`/feeds/${feedId}`);
  return processFeed(feedsResponse.data);
};

export const updateFeeds = async (): Promise<UpdateFeedsResponse> =>
  apiFetch(`/feeds/update_feeds`, {
    method: "POST",
  });
