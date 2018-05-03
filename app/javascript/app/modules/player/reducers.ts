import { Action, actions } from "./actions";

export interface State {
  episodeId?: string;
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
    default:
      return state;
  }
};

export default player;
