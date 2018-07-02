import { Status } from "../status";

export interface QueryParams {
  status: Status;
  feedId?: number;
  searchTerm: string;
  currentPage: number;
}
