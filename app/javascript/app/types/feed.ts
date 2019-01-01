import { Omit } from "./util";

export type SourceType = "youtube" | "rss";

export interface Source {
  url: string;
  sourceType: SourceType;
  disabled: boolean;
}

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
  sources: Source[];
}

export interface RemoteFeed extends Omit<ApiFeed, "id"> {
  key: string;
  id: string;
}
