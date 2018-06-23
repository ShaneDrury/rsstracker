export type StatusKey = "all" | "notAsked" | "success" | "failure" | "loading";

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
  statusCounts: StatusCounts;
  url: string;
  updatedAt: string;
}

export interface RemoteFeed extends ApiFeed {
  key: string;
}
