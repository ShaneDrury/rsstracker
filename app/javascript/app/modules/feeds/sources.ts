import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed } from "../../types/feed";
import apiFetch from "../apiFetch";

export const processFeed = (feed: ApiFeed): RemoteFeed => ({
  ...feed,
  key: shortid.generate(),
});

export const getFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  const camel = camelcaseKeys(feedsResponse, { deep: true });
  return camel.map(processFeed);
};

export const updateFeed = async (feedId: number): Promise<void> =>
  apiFetch(`/feeds/${feedId}/update_feed`, { method: "POST" });

export const updateFeeds = async (): Promise<void> =>
  apiFetch(`/feeds/update_feeds`, { method: "POST" });
