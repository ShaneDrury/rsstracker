import { RemoteFeed } from "../../types/feed";
import { RootState } from "../reducers";
import { RemoteData } from "../remoteData";

export const getFeeds = (
  state: RootState
): { [key: string]: RemoteData<RemoteFeed> } => state.feeds;
