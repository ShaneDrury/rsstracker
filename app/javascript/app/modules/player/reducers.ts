import { Action, actions } from "./actions";

export interface State {
  playingEpisodeId?: string;
  saved: {
    [key: string]: number;
  };
  playing: boolean;
  enabled: boolean;
}

const savedSecondsJSON = localStorage.getItem("savedSeconds");
const savedSeconds = savedSecondsJSON ? JSON.parse(savedSecondsJSON) : {};

const playingEpisodeIdJSON = localStorage.getItem("lastPlayedEpisode");
const playingEpisodeId = playingEpisodeIdJSON
  ? JSON.parse(playingEpisodeIdJSON)
  : undefined;

const initialState: State = {
  saved: savedSeconds,
  playingEpisodeId,
  playing: false,
  enabled: false,
};

const player = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actions.PLAYED_SECONDS_UPDATED: {
      return {
        ...state,
        saved: {
          ...state.saved,
          [action.payload.episodeId]: action.payload.playedSeconds,
        },
      };
    }
    case actions.PLAYER_PAUSED: {
      return {
        ...state,
        playing: false,
      };
    }
    case actions.PLAYER_RESUMED: {
      return {
        ...state,
        playing: true,
      };
    }
    case actions.PLAY_TOGGLED: {
      if (state.playingEpisodeId === action.payload.playingEpisodeId) {
        return {
          ...state,
          playingEpisodeId: undefined,
          playing: false,
        };
      }
      return {
        ...state,
        playingEpisodeId: action.payload.playingEpisodeId,
        playing: true,
        enabled: true,
      };
    }
    case actions.PLAYER_ENABLED: {
      return {
        ...state,
        enabled: true,
      };
    }
    default:
      return state;
  }
};

export default player;
