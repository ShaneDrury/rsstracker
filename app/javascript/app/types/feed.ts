import { Omit } from "./util";

export type SourceType = "youtube" | "rss";

export type FeedSourceType = SourceType | "mixed" | undefined;

export interface Source {
  url: string;
  sourceType: SourceType;
  disabled: boolean;
  id: number;
  name: string;
  feed?: {
    id: number;
  };
}

export interface ApiFeed {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
  autodownload: boolean;
  sources: Source[];
  sourceType: FeedSourceType;
}

export interface RemoteFeed extends Omit<ApiFeed, "id"> {
  key: string;
  id: string;
}
