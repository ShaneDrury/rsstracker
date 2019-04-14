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
  seen: boolean;
  smallThumbnail?: string;
  largeThumbnail?: string;
}

export interface RemoteEpisode extends Omit<ApiEpisode, "id"> {
  id: string;
  updating: boolean;
}
