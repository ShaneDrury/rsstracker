import { Status } from "../filters";

export interface QueryParams {
  status: Status;
  feedId?: number;
  searchTerm: string;
  currentPage: number;
}
