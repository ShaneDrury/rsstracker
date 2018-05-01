export enum feedActions {
  FETCH_FEEDS_START = "FETCH_FEEDS_START"
}

interface FetchFeedsStart {
  type: feedActions.FETCH_FEEDS_START;
}

export const fetchFeedsStart = (): FetchFeedsStart => ({
  type: feedActions.FETCH_FEEDS_START
});

export type FeedsAction = FetchFeedsStart;
