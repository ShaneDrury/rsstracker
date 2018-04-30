import camelcaseKeys from "camelcase-keys";
import apiFetch from "../apiFetch";
import { RemoteFeed } from "../../types/feed";

export const getFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  return camelcaseKeys(feedsResponse)
};

export const getFeed = async (feedId: number): Promise<RemoteFeed> => {
  const feedResponse = await apiFetch(`/feeds/${feedId}`);
  return camelcaseKeys(feedResponse)
};

export const updateFeed = async (feedId: number): Promise<void> => {
  return apiFetch(`/feeds/${feedId}/update_feed`, { method: "POST" })
};
