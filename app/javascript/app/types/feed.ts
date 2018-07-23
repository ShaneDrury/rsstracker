import { Omit } from "./util";

export interface StatusCounts {
  all: number;
  notAsked?: number;
  success?: number;
  failure?: number;
  loading?: number;
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
}

export interface RemoteFeed extends Omit<ApiFeed, "id"> {
  key: string;
  id: string;
  stale: boolean;
}
