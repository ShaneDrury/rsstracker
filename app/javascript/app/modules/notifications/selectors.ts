import { createSelector } from "reselect";
import { NotificationInfo } from "../../types/notification";
import { RootState } from "../reducers";

const getNotificationItems = (state: RootState) => state.notifications.items;

const getNotificationIds = (state: RootState) => state.notifications.ids;

export const getNotifications = createSelector(
  getNotificationItems,
  getNotificationIds,
  (notifications, ids): NotificationInfo[] => ids.map(id => notifications[id])
);
