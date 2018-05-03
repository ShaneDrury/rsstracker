export interface ApiFeed {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  relativeImageLink: string;
  url: string;
  updatedAt: string;
}

export interface RemoteFeed extends ApiFeed {
  key: string;
}
