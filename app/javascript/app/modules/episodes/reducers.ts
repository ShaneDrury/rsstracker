import { forEach } from "lodash";
import * as qs from "qs";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { Filter } from "../filters";
import { FetchStatus } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteEpisode;
  };
  fetchStatus: FetchStatus;
  ids: number[];
  pageInfo?: PageInfo;
  searchTerm?: string;
  status: Filter;
}

const initialState: State = {
  items: {},
  fetchStatus: "NOT_ASKED",
  ids: [],
  status: Filter.ALL,
};

const episodes = (
  state: State = initialState,
  action: EpisodesAction | LocationChangeAction
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
    case LOCATION_CHANGE: {
      const search = action.payload.search;
      const params = qs.parse(search, { ignoreQueryPrefix: true });
      return {
        ...state,
        status: params.filter,
        searchTerm: params.searchTerm,
      };
    }
    default:
      return state;
  }
};

export default episodes;
