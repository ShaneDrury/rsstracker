import { History } from "history";
import { isEqual } from "lodash";
import * as qs from "qs";
import { Status } from "../status";

export interface QueryParams {
  status?: Status;
  searchTerm?: string;
  currentPage: number;
}

export interface SearchParams extends QueryParams {
  feedId?: string;
}

interface Changes {
  status?: Status;
  searchTerm?: string;
}

export const syncQueryParams = (
  { status, searchTerm }: Changes,
  queryParams: QueryParams,
  history: History
) => {
  const newParams: Partial<QueryParams> = {};
  if (!(typeof status === "undefined")) {
    newParams.status = status;
  }
  if (!(typeof searchTerm === "undefined")) {
    newParams.searchTerm = searchTerm;
  }
  const newQueryParams = { ...queryParams, ...newParams };
  if (!isEqual(newQueryParams, queryParams)) {
    history.push({ search: `?${qs.stringify(newQueryParams)}` });
  }
};
