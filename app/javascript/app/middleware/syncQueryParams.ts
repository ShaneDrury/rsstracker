import { Middleware } from "redux";
import {
  episodeActions as actions,
  EpisodesAction,
} from "../modules/episodes/actions";
import { getLocation } from "../modules/location/selectors";
import { updateQueryParams } from "../modules/queryParams";
import { history } from "../store";

const syncQueryParams: Middleware = store => next => (
  action: EpisodesAction
) => {
  if (action.type === actions.CHANGE_FILTER) {
    const state = store.getState();
    const location = getLocation(state);
    const queryParams = location ? location.search : "";
    const newQueryParams = updateQueryParams(queryParams, {
      filter: action.payload.filter,
    });
    history.push({ search: `?${newQueryParams}` });
  }
  return next(action);
};

export default syncQueryParams;
