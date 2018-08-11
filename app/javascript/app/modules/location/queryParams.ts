import { Status } from "../status";

export interface QueryParams {
  status: Status;
  searchTerm: string;
  currentPage: number;
}

export interface SearchParams extends QueryParams {
  feedId?: string;
}
