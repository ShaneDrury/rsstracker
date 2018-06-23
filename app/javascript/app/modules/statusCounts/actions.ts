import { StatusCounts } from "../../types/feed";

export enum statusActions {
  FETCH_STATUSES_COMPLETE = "FETCH_STATUSES_COMPLETE",
}

interface FetchStatusesComplete {
  type: statusActions.FETCH_STATUSES_COMPLETE;
  payload: {
    statusCounts: StatusCounts;
  };
}

export const fetchStatusesComplete = (
  statusCounts: StatusCounts
): FetchStatusesComplete => ({
  type: statusActions.FETCH_STATUSES_COMPLETE,
  payload: { statusCounts },
});

export type StatusCountsAction = FetchStatusesComplete;
