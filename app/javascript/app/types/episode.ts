import { FetchStatus } from "../modules/fetchStatus";

export interface ApiEpisode {
  id: number;
  description: string;
  duration: string;
  guid: string;
  name: string;
  url: string;
  fetchStatus: FetchStatus;
}

export interface RemoteEpisode extends ApiEpisode {
  key: string;
}
