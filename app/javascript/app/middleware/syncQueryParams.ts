import { Middleware } from "redux";
import {
  episodeActions as actions,
  EpisodesAction,
} from "../modules/episodes/actions";
import { getQueryParams } from "../modules/location/selectors";
import { updateQueryParams } from "../modules/queryParams";
import { history } from "../store";

const syncQueryParams: Middleware = store => next => (
  action: EpisodesAction
) => {
  if (action.type === actions.CHANGE_FILTER) {
    const state = store.getState();
    const params = getQueryParams(state);
    const newQueryParams = updateQueryParams(params, {
      filter: action.payload.filter,
    });
    history.push({ search: `?${newQueryParams}` });
  }
  if (action.type === actions.CHANGE_SEARCH) {
    const state = store.getState();
    const params = getQueryParams(state);
    const newQueryParams = updateQueryParams(params, {
      searchTerm: action.payload.searchTerm,
    });
    history.push({ search: `?${newQueryParams}` });
  }
  return next(action);
};

export default syncQueryParams;
