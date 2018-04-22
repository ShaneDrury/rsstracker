import { FetchStatus } from "../modules/fetchStatus";

export interface RemoteEpisode {
  id: number;
  description: string;
  duration: string;
  guid: string;
  name: string;
  url: string;
  fetchStatus: FetchStatus;
}
