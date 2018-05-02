import { forEach } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { RemoteData } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteData<RemoteEpisode>;
  };
  filter: Filter;
}

const initialState: State = { items: {}, filter: Filter.ALL };

const episodes = (
  state: State = initialState,
  action: EpisodesAction
): State => {
  switch (action.type) {
    case episodeActions.FETCH_EPISODES_START:
      return state;
    case episodeActions.FETCH_EPISODES_COMPLETE: {
      const remoteEpisodes: { [key: string]: RemoteData<RemoteEpisode> } = {};
      forEach(action.payload.episodes, episode => {
        remoteEpisodes[episode.id] = { type: "SUCCESS", data: episode };
      });
      return {
        ...state,
        items: {
          ...state.items,
          ...remoteEpisodes
        }
      };
    }
    case episodeActions.CHANGE_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };
    default:
      return state;
  }
};

export default episodes;
