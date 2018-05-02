import { forEach } from "lodash";
import { RemoteEpisode } from "../../types/episode";
import { RemoteData } from "../remoteData";
import { episodeActions, EpisodesAction } from "./actions";

export interface State {
  [key: string]: RemoteData<RemoteEpisode>;
}

const initialState: State = {};

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
        ...remoteEpisodes
      };
    }
    default:
      return state;
  }
};

export default episodes;
