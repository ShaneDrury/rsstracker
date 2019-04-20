import Cable from "actioncable";
import { Dispatch, Store } from "redux";
import { RootAction } from "./modules/actions";
import { updateEpisodeComplete } from "./modules/episodes/actions";
import { processEpisode } from "./modules/episodes/sources";
import { updateFeedComplete } from "./modules/feedJobs/actions";
import { processFeed } from "./modules/feeds/sources";
import { jobComplete, jobError, newJob } from "./modules/jobs/actions";
import { processJobResponse } from "./modules/jobs/sources";
import { RootState } from "./modules/reducers";
import { ApiEpisode } from "./types/episode";
import { ApiFeed } from "./types/feed";
import { ProviderJob } from "./types/job";

interface Meta extends Element {
  content: string;
}

interface UpdateFeed {
  type: "UPDATE_FEED";
  payload: {
    feed: ApiFeed;
  };
}

interface UpdateEpisode {
  type: "UPDATE_EPISODE";
  payload: {
    episode: ApiEpisode;
  };
}

interface JobComplete {
  type: "JOB_COMPLETE";
  payload: {
    jobId: number;
  };
}

interface JobError {
  type: "JOB_ERROR";
  payload: {
    job: ProviderJob;
  };
}

interface JobStart {
  type: "JOB_START";
  payload: {
    job: ProviderJob;
  };
}

type CableAction =
  | UpdateFeed
  | UpdateEpisode
  | JobComplete
  | JobError
  | JobStart;

const handleCableAction = (
  action: CableAction,
  dispatch: Dispatch<RootAction>
) => {
  switch (action.type) {
    case "UPDATE_FEED": {
      const feed = action.payload.feed;
      dispatch(updateFeedComplete(processFeed(feed.data)));
      break;
    }
    case "UPDATE_EPISODE": {
      const episode = action.payload.episode;
      dispatch(updateEpisodeComplete(processEpisode(episode.data)));
      break;
    }
    case "JOB_COMPLETE": {
      const jobId = action.payload.jobId;
      dispatch(jobComplete(jobId.toString()));
      break;
    }
    case "JOB_ERROR": {
      const job = action.payload.job;
      dispatch(jobError(processJobResponse(job.data)));
      break;
    }
    case "JOB_START": {
      const job = action.payload.job;
      dispatch(newJob(processJobResponse(job.data)));
      break;
    }
  }
};

export const init = (store: Store<RootState>) => {
  const meta = document.head.querySelector("[name=action-cable-url]") as Meta;
  const url = meta ? meta.content : "";

  const cable = Cable.createConsumer(url);
  cable.subscriptions.create(
    {
      channel: "FeedsChannel",
    },
    {
      connected: () => {},
      received: (action: CableAction) => {
        handleCableAction(action, store.dispatch);
      },
      disconnected: () => {},
    }
  );
};
