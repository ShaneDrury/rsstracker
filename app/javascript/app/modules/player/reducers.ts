import { Action, actions } from "./actions";

export interface State {
  episodeId?: number;
  playedSeconds: number;
}

const initialState: State = {
  playedSeconds: 0
};

const player = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actions.UPDATE_PLAYED_SECONDS: {
      return {
        ...state,
        playedSeconds: action.payload.playedSeconds
      };
    }
    case actions.TOGGLE_PLAY: {
      if (state.episodeId === action.payload.episodeId) {
        return {
          playedSeconds: 0,
          episodeId: undefined
        };
      }
      return {
        playedSeconds: 0,
        episodeId: action.payload.episodeId
      };
    }
    default:
      return state;
  }
};

export default player;
