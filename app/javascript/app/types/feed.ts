import { Omit } from "./util";

export type FeedSource = "youtube" | "rss";

export interface ApiFeed {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  relativeImageLink: string;
  url: string;
  updatedAt: string;
  disabled: boolean;
  autodownload: boolean;
  source: FeedSource;
}

export interface RemoteFeed extends Omit<ApiFeed, "id"> {
  key: string;
  id: string;
}
