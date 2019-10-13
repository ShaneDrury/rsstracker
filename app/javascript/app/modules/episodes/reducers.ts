import { forEach, union } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import { FeedsAction } from "../feeds/actions";
import { FetchStatus } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteEpisode;
  };
  fetchStatus: FetchStatus;
  ids: string[];
  pageInfo: PageInfo;
}

const initialState: State = {
  items: {},
  fetchStatus: "NOT_ASKED",
  ids: [],
  pageInfo: {
    count: 0,
    currentPage: 1,
    limitValue: 10,
    totalPages: 1,
    firstPage: true,
    lastPage: false,
    outOfRange: false,
  },
};

const episodes = (
  state: State = initialState,
  action: EpisodesAction | FeedsAction
): State => {
  switch (action.type) {
    case episodeActions.FETCH_EPISODES_REQUESTED: {
      return {
        ...state,
        fetchStatus: "LOADING",
      };
    }
    case episodeActions.FETCH_EPISODES_BY_ID_COMPLETE: {
      const remoteEpisodes: { [key: string]: RemoteEpisode } = {};
      forEach(action.payload.episodes, episode => {
        remoteEpisodes[episode.id] = episode;
      });
      return {
        ...state,
        items: {
          ...state.items,
          ...remoteEpisodes,
        },
      };
    }
    case episodeActions.FETCH_EPISODES_COMPLETE: {
      const remoteEpisodes: { [key: string]: RemoteEpisode } = {};
      const ids: string[] = action.payload.episodes.map(episode => episode.id);
      forEach(action.payload.episodes, episode => {
        remoteEpisodes[episode.id] = episode;
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
    case episodeActions.UPDATE_EPISODE_COMPLETE:
    case episodeActions.FETCH_EPISODE_COMPLETE: {
      const episode = action.payload.episode;
      return {
        ...state,
        items: {
          ...state.items,
          [episode.id]: episode,
        },
        ids: union(state.ids, episode.id),
      };
    }
    case episodeActions.UPDATE_EPISODE_REQUESTED: {
      const episodeId = action.payload.episodeId;
      const episode = state.items[episodeId];
      return {
        ...state,
        items: {
          ...state.items,
          [episodeId]: {
            ...episode,
            updating: true,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default episodes;
