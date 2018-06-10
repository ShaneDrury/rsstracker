import * as qs from "qs";
import { Middleware } from "redux";
import {
  episodeActions as actions,
  EpisodesAction,
} from "../modules/episodes/actions";
import { QueryParams } from "../modules/location/queryParams";
import { getQueryParams } from "../modules/location/selectors";
import { history } from "../store";

const syncQueryParams: Middleware = store => next => (
  action: EpisodesAction
) => {
  if (
    action.type === actions.CHANGE_FILTER ||
    action.type === actions.CHANGE_SEARCH
  ) {
    const state = store.getState();
    const params = getQueryParams(state);
    const newParams: QueryParams = {};
    if (action.type === actions.CHANGE_FILTER) {
      newParams.filter = action.payload.filter;
    }
    if (action.type === actions.CHANGE_SEARCH) {
      newParams.searchTerm = action.payload.searchTerm;
    }
    const newQueryParams = qs.stringify({ ...params, ...newParams });
    history.push({ search: `?${newQueryParams}` });
  }
  return next(action);
};

export default syncQueryParams;