import { forEach } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { FetchStatus } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteEpisode;
  };
  fetchStatus: FetchStatus;
  ids: number[];
  pageInfo?: PageInfo;
}

const initialState: State = {
  items: {},
  fetchStatus: "NOT_ASKED",
  ids: [],
};

const episodes = (
  state: State = initialState,
  action: EpisodesAction
): State => {
  switch (action.type) {
    case episodeActions.FETCH_EPISODES_START: {
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    }
    case episodeActions.FETCH_EPISODES_COMPLETE: {
      const remoteEpisodes: { [key: string]: RemoteEpisode } = {};
      const ids: number[] = [];
      forEach(action.payload.episodes, episode => {
        remoteEpisodes[episode.id] = episode;
        ids.push(episode.id);
      });
      return {
        ...state,
        ids,
        fetchStatus: "SUCCESS",
        pageInfo: action.payload.pageInfo,
        items: {
          ...state.items,
          ...remoteEpisodes,
        },
      };
    }
    case episodeActions.CHANGE_PAGE: {
      if (state.pageInfo) {
        return {
          ...state,
          pageInfo: {
            ...state.pageInfo,
            currentPage: action.payload.currentPage,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default episodes;
