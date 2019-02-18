import { difference, omit, union } from "lodash";
import { RemoteJob } from "../../types/job";
import { feedActions, FeedsAction } from "../feeds/actions";
import { jobActions, JobsAction } from "../jobs/actions";
import { JobDescription } from "../jobs/descriptions";

export interface State {
  items: {
    [key: string]: JobDescription;
  };
  ids: string[];
}

const initialState: State = { items: {}, ids: [] };

const keyFromJob = (job: RemoteJob): string => {
  const parts = [job.id];
  if (job.lastError) {
    parts.push("error");
  }
  return parts.join("-");
};

export default (
  state: State = initialState,
  action: FeedsAction | JobsAction
): State => {
  switch (action.type) {
    case feedActions.FEEDS_UPDATING: {
      const feeds = action.payload.feeds;
      const job = action.payload.job;
      const notifications: {
        [key: string]: JobDescription;
      } = {};
      const ids: string[] = [];
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
        ids.push(job.id);
        // TODO: Can get rid of key, as id will stay the same
      });
      return {
        items: { ...state.items, ...notifications },
        ids: union(state.ids, ids),
      };
    }
    case jobActions.REMOVE_JOB_COMPLETE:
    case jobActions.JOB_COMPLETE: {
      const newIds = difference(state.ids, [action.payload.jobId]);
      const newItems = omit(state.items, [action.payload.jobId]);
      return {
        ...state,
        ids: newIds,
        items: newItems,
      };
    }
    default:
      return state;
  }
};
