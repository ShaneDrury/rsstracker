import { FetchStatus } from "../modules/fetchStatus";

export interface EpisodeAttributes {
  description: string;
  duration: string;
  guid: string;
  name: string;
  url: string;
  fullUrl: string;
  publicationDate: string;
  seen: boolean;
  smallThumbnail?: string;
  largeThumbnail?: string;
}

export interface EpisodeData {
  id: number;
  type: "episodes";
  attributes: EpisodeAttributes;
  relationships: {
    fetchStatus: { data: FetchStatus };
    feed: {
      data: { id: string; type: "feeds" };
    };
  };
}

export interface ApiEpisode {
  data: EpisodeData;
}

export interface ApiEpisodes {
  data: EpisodeData[];
}

export interface RemoteEpisode extends EpisodeAttributes {
  id: string;
  updating: boolean;
  fetchStatus: FetchStatus;
  feedId: string;
}
