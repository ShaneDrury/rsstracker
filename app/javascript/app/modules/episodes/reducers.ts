import { forEach } from "lodash";
import { LocationChangeAction } from "react-router-redux";
import { RemoteEpisode } from "../../types/episode";
import { StatusCounts } from "../../types/feed";
import { PageInfo } from "../../types/page";
import { feedActions, FeedsAction } from "../feeds/actions";
import { FetchStatus } from "../remoteData";
import { Status } from "../status";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteEpisode;
  };
  fetchStatus: FetchStatus;
  ids: number[];
  pageInfo: PageInfo;
  searchTerm: string;
  status: Status;
  statusCounts: StatusCounts;
}

const initialState: State = {
  items: {},
  fetchStatus: "NOT_ASKED",
  ids: [],
  searchTerm: "",
  status: Status.ALL,
  pageInfo: {
    count: 0,
    currentPage: 1,
    limitValue: 10,
    totalPages: 1,
    firstPage: true,
    lastPage: false,
    outOfRange: false,
  },
  statusCounts: {
    all: 0,
  },
};

const episodes = (
  state: State = initialState,
  action: EpisodesAction | LocationChangeAction | FeedsAction
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
        statusCounts: action.payload.statusCounts,
      };
    }
    case episodeActions.PAGE_CHANGED: {
      return {
        ...state,
        pageInfo: {
          ...state.pageInfo,
          currentPage: action.payload.currentPage,
        },
      };
    }
    case episodeActions.FETCH_EPISODE_COMPLETE: {
      const episode = action.payload.episode;
      return {
        ...state,
        items: {
          ...state.items,
          [episode.id]: episode,
        },
      };
    }

    case episodeActions.FILTER_CHANGED: {
      return {
        ...state,
        status: action.payload.status,
      };
    }
    case episodeActions.SEARCH_CHANGED: {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };
    }
    case feedActions.FETCH_FEEDS_COMPLETE: {
      return {
        ...state,
        statusCounts: action.payload.statusCounts,
      };
    }
    default:
      return state;
  }
};

export default episodes;
