import { createSelector } from "reselect";
import { JobDescription } from "../jobs/descriptions";
import { RootState } from "../reducers";

const getNotificationItems = (state: RootState) => state.notifications.items;

const getNotificationIds = (state: RootState) => state.notifications.ids;

export const getNotifications = createSelector(
  getNotificationItems,
  getNotificationIds,
  (notifications, ids): JobDescription[] => ids.map(id => notifications[id])
);
