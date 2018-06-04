import { Middleware } from "redux";
import { Action as PlayerAction, actions } from "../modules/player/actions";

const savePlayingEpisode: Middleware = _ => next => (action: PlayerAction) => {
  if (action.type === actions.TOGGLE_PLAY) {
    localStorage.setItem(
      "lastPlayedEpisode",
      JSON.stringify(action.payload.playingEpisodeId)
    );
  }
  return next(action);
};

export default savePlayingEpisode;
