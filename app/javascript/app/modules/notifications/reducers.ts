import { RemoteJob } from "../../types/job";
import { feedActions, FeedsAction } from "../feeds/actions";

interface NotificationInfo {
  id: string;
  key: string;
  description: string;
  error?: string;
}

export interface State {
  items: {
    [key: string]: NotificationInfo;
  };
}

const initialState: State = { items: {} };

const keyFromJob = (job: RemoteJob): string => {
  const parts = [job.id];
  if (job.lastError) {
    parts.push("error");
  }
  return parts.join("-");
};

export default (state: State = initialState, action: FeedsAction): State => {
  switch (action.type) {
    case feedActions.FEEDS_UPDATING: {
      const feeds = action.payload.feeds;
      const job = action.payload.job;
      const notifications: {
        [key: string]: NotificationInfo;
      } = {};
      feeds.forEach(feed => {
        const name = feed.name;
        const errorMessage = job.lastError && job.lastError.split("\n")[0];
        const error = errorMessage
          ? `${errorMessage} during Updating: ${name}`
          : undefined;
        notifications[job.id] = {
          id: job.id,
          key: keyFromJob(job),
          description: `Updating: ${name}`,
          error,
        };
        // TODO: Can get rid of key, as id will stay the same
      });
      return { items: { ...state.items, ...notifications } };
    }
    default:
      return state;
  }
};
