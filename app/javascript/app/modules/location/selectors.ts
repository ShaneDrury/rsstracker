import * as qs from "qs";
import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { QueryParams } from "./queryParams";

export const getLocation = (state: RootState) => state.routing.location;

export const getQueryParams = createSelector(
  getLocation,
  (location): QueryParams =>
    location
      ? qs.parse(location.search, {
          ignoreQueryPrefix: true,
        })
      : {}
);
