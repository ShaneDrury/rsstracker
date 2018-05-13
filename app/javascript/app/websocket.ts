import Cable from "actioncable";
import camelcaseKeys from "camelcase-keys";
import { Store } from "react-redux";
import { Dispatch } from "redux";
import { RootAction } from "./modules/actions";
import { fetchEpisodeComplete } from "./modules/episodes/actions";
import { processEpisode } from "./modules/episodes/sources";
import { fetchFeedComplete } from "./modules/feeds/actions";
import { processFeed } from "./modules/feeds/sources";
import { removeJobs } from "./modules/jobs/actions";
import { RootState } from "./modules/reducers";
import { ApiEpisode } from "./types/episode";
import { ApiFeed } from "./types/feed";

interface Meta extends Element {
  content: string;
}

interface UpdateFeed {
  type: "UPDATE_FEED";
  payload: {
    feed: string;
  };
}

interface UpdateEpisode {
  type: "UPDATE_EPISODE";
  payload: {
    episode: string;
  };
}

interface JobComplete {
  type: "JOB_COMPLETE";
  payload: {
    jobId: string;
  };
}

type CableAction = UpdateFeed | UpdateEpisode | JobComplete;

const handleCableAction = (
  action: CableAction,
  dispatch: Dispatch<RootAction, RootState>
) => {
  const payload = camelcaseKeys(action.payload, { deep: true });
  switch (action.type) {
    case "UPDATE_FEED": {
      const feed: ApiFeed = payload.feed;
      dispatch(fetchFeedComplete(processFeed(feed)));
      break;
    }
    case "UPDATE_EPISODE": {
      const episode: ApiEpisode = payload.episode;
      dispatch(fetchEpisodeComplete(processEpisode(episode)));
      break;
    }
    case "JOB_COMPLETE": {
      const jobId = payload.jobId;
      dispatch(removeJobs([jobId.toString()]));
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
