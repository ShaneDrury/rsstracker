import { invert, omit } from "lodash";
import { jobActions, JobsAction } from "../jobs/actions";
import { EpisodeJobsAction, episodeJobsActions } from "./actions";

export interface State {
  items: {
    [key: string]: string;
  };
}

const initialState: State = { items: {} };

const episodeJobs = (
  state: State = initialState,
  action: EpisodeJobsAction | JobsAction
): State => {
  switch (action.type) {
    case episodeJobsActions.DOWNLOAD_EPISODE_STARTED: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.episodeId]: action.payload.job.id,
        },
      };
    }
    case jobActions.FETCH_JOBS_COMPLETE: {
      const newJobs = action.payload.jobs.reduce<{ [key: string]: string }>(
        (acc, job) => {
          switch (job.jobData.jobClass) {
            case "DownloadYoutubeAudioJob":
            case "DownloadEpisodeJob": {
              return {
                ...acc,
                [job.jobData.arguments[0]]: job.id,
              };
            }
            default:
              return acc;
          }
        },
        {}
      );
      return {
        ...state,
        items: {
          ...state.items,
          ...newJobs,
        },
      };
    }
    case jobActions.REMOVE_JOB_COMPLETE:
    case jobActions.JOB_COMPLETE: {
      const jobsByEpisodeId = invert(state.items);
      return {
        ...state,
        items: omit(jobsByEpisodeId, [action.payload.jobId]),
      };
    }
    default:
      return state;
  }
};

export default episodeJobs;
