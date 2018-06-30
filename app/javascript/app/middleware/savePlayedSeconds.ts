import { Middleware } from "redux";
import { Action as PlayerAction, actions } from "../modules/player/actions";
import { getPlayedSeconds } from "../modules/player/selectors";

const savePlayedSeconds: Middleware = store => next => (
  action: PlayerAction
) => {
  if (action.type === actions.PLAYED_SECONDS_UPDATED) {
    const state = store.getState();
    const savedSecondsJSON = localStorage.getItem("savedSeconds");
    const savedSeconds = savedSecondsJSON && JSON.parse(savedSecondsJSON);
    if (savedSeconds !== action.payload) {
      localStorage.setItem(
        "savedSeconds",
        JSON.stringify(getPlayedSeconds(state))
      );
    }
  }
  return next(action);
};

export default savePlayedSeconds;
