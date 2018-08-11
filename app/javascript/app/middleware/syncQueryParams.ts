import { isEqual } from "lodash";
import * as qs from "qs";
import { Middleware } from "redux";
import {
  episodeActions as actions,
  EpisodesAction,
} from "../modules/episodes/actions";
import { SearchParams } from "../modules/location/queryParams";
import { getRoutingQueryParams } from "../modules/location/selectors";
import { history } from "../store";

const syncQueryParams: Middleware = store => next => (
  action: EpisodesAction
) => {
  if (
    action.type === actions.FILTER_CHANGED ||
    action.type === actions.SEARCH_CHANGED
  ) {
    const state = store.getState();
    const params = getRoutingQueryParams(state);
    const newParams: Partial<SearchParams> = {};
    if (action.type === actions.FILTER_CHANGED) {
      newParams.status = action.payload.status;
    }
    if (action.type === actions.SEARCH_CHANGED) {
      newParams.searchTerm = action.payload.searchTerm;
    }
    const newQueryParams = { ...params, ...newParams };
    if (!isEqual(newQueryParams, params)) {
      history.push({ search: `?${qs.stringify(newQueryParams)}` });
    }
  }
  return next(action);
};

export default syncQueryParams;
