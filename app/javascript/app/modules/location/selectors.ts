import * as qs from "qs";
import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { SearchParams } from "./queryParams";

export const getLocation = (state: RootState) => state.routing.location;

export const getRoutingQueryParams = createSelector(
  getLocation,
  (location): SearchParams =>
    location
      ? qs.parse(location.search, {
          ignoreQueryPrefix: true,
        })
      : {}
);
