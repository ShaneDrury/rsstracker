export interface PageInfo {
  count: number;
  currentPage: number;
  limitValue: number;
  totalPages: number;
  nextPage?: number;
  prevPage?: number;
  firstPage: boolean;
  lastPage: boolean;
  outOfRange: boolean;
}
