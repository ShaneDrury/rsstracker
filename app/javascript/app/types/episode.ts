import { FetchStatus } from "../modules/fetchStatus";
import { Omit } from "./util";

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
  thumbnailUrl?: string;
  seen: boolean;
}

export interface RemoteEpisode extends Omit<ApiEpisode, "id"> {
  id: string;
  updating: boolean;
}
