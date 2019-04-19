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

interface FeedAttributes {
  name: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
  autodownload: boolean;
  sourceType: FeedSourceType;
}

export interface FeedData {
  id: number;
  type: "feeds";
  attributes: FeedAttributes;
  relationships: {
    allSources: {
      data: Source[];
    };
  };
}

export interface ApiFeed {
  data: FeedData;
}

export interface ApiFeeds {
  data: FeedData[];
}

export interface RemoteFeed extends FeedAttributes {
  key: string;
  id: string;
  sources: Source[];
}
