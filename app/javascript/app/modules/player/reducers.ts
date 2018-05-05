import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { Action, actions } from "./actions";

export interface State {
  playingEpisodeId?: number;
  saved: {
    [key: number]: number;
  };
}

const savedSecondsJSON = localStorage.getItem("savedSeconds");
const savedSeconds = savedSecondsJSON ? JSON.parse(savedSecondsJSON) : {};

const initialState: State = {
  saved: savedSeconds
};

const player = (
  state: State = initialState,
  action: Action | LocationChangeAction
): State => {
  switch (action.type) {
    case actions.UPDATE_PLAYED_SECONDS: {
      return {
        ...state,
        saved: {
          ...state.saved,
          [action.payload.episodeId]: action.payload.playedSeconds
        }
      };
    }
    case actions.TOGGLE_PLAY: {
      if (state.playingEpisodeId === action.payload.playingEpisodeId) {
        return {
          ...state,
          playingEpisodeId: undefined
        };
      }
      return {
        ...state,
        playingEpisodeId: action.payload.playingEpisodeId
      };
    }
    case LOCATION_CHANGE:
      return {
        ...state,
        playingEpisodeId: undefined
      };
    default:
      return state;
  }
};

export default player;