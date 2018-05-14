export type StatusKey = "all" | "notAsked" | "success" | "failure" | "loading";

export interface ApiFeed {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  relativeImageLink: string;
  statusCounts: { [key in StatusKey]?: number };
  url: string;
  updatedAt: string;
}

export interface RemoteFeed extends ApiFeed {
  key: string;
}
