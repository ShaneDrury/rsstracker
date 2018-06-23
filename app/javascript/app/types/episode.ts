import { FetchStatus } from "../modules/fetchStatus";

export interface ApiEpisode {
  id: number;
  description: string;
  duration: string;
  feedId: string;
  guid: string;
  name: string;
  url: string;
  fullUrl: string;
  fetchStatus: FetchStatus;
  publicationDate: string;
}

export interface RemoteEpisode extends ApiEpisode {
  key: string;
}
