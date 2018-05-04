import { forEach } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { RemoteData } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  items: {
    [key: string]: RemoteData<RemoteEpisode>;
  };
  ids: number[];
  filter: Filter;
}

const initialState: State = { items: {}, filter: Filter.ALL, ids: [] };

const episodes = (
  state: State = initialState,
  action: EpisodesAction
): State => {
  switch (action.type) {
    case episodeActions.FETCH_EPISODES_START:
      return state;
    case episodeActions.FETCH_EPISODES_COMPLETE: {
      const remoteEpisodes: { [key: string]: RemoteData<RemoteEpisode> } = {};
      const ids: number[] = [];
      forEach(action.payload.episodes, episode => {
        remoteEpisodes[episode.id] = { type: "SUCCESS", data: episode };
        ids.push(episode.id);
      });
      return {
        ...state,
        ids,
        items: {
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
