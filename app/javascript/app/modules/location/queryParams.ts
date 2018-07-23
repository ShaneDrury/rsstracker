import { Status } from "../status";

export interface QueryParams {
  status: Status;
  feedId?: string;
  searchTerm: string;
  currentPage: number;
}
