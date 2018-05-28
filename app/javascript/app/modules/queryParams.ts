import * as qs from "qs";
import { QueryParams } from "./location/queryParams";

export const updateQueryParams = (
  previous: QueryParams,
  changes: { [key: string]: string }
) => {
  return qs.stringify({ ...previous, ...changes });
};
