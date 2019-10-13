import { Action, actions } from "./actions";
import { episodeActions, EpisodesAction } from "../episodes/actions";

export interface State {
  playingEpisodeId?: string;
  saved: {
    [key: string]: number;
  };
  playing: boolean;
  enabled: boolean;
  detailEpisodeId?: string;
}

const detailEpisodeIdJSON = localStorage.getItem("lastPlayedEpisode");
const detailEpisodeId = detailEpisodeIdJSON
  ? JSON.parse(detailEpisodeIdJSON)
  : undefined;

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
  detailEpisodeId,
};

const player = (
  state: State = initialState,
  action: Action | EpisodesAction
): State => {
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
        detailEpisodeId: action.payload.playingEpisodeId,
        playing: true,
        enabled: true,
      };
    }
    case actions.PLAYER_ENABLED: {
      return {
        ...state,
        playing: true,
        enabled: true,
      };
    }
    case episodeActions.DETAILS_OPENED: {
      return {
        ...state,
        detailEpisodeId: action.payload.episodeId,
      };
    }
    case episodeActions.DETAILS_CLOSED: {
      return {
        ...state,
        detailEpisodeId: undefined,
      };
    }
    default:
      return state;
  }
};

export default player;
