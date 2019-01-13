import { Omit } from "./util";

export type SourceType = "youtube" | "rss";

export interface Source {
  url: string;
  sourceType: SourceType;
  disabled: boolean;
  id: number;
  feedId: number;
}

export interface ApiFeed {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  relativeImageLink: string;
  updatedAt: string;
  autodownload: boolean;
  sources: Source[];
}

export interface RemoteFeed extends Omit<ApiFeed, "id"> {
  key: string;
  id: string;
}
