import camelcaseKeys from "camelcase-keys";
import * as shortid from "shortid";
import { ApiFeed, RemoteFeed } from "../../types/feed";
import apiFetch from "../apiFetch";

export const getFeeds = async (): Promise<RemoteFeed[]> => {
  const feedsResponse = await apiFetch("/feeds");
  const camel = camelcaseKeys(feedsResponse);
  return camel.map((feed: ApiFeed) => ({ ...feed, key: shortid.generate() }));
};

export const updateFeed = async (feedId: number): Promise<void> => {
  return apiFetch(`/feeds/${feedId}/update_feed`, { method: "POST" });
};
