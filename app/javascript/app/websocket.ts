import Cable from "actioncable";
import camelcaseKeys from "camelcase-keys";
import { fetchEpisodeComplete } from "./modules/episodes/actions";
import { processEpisode } from "./modules/episodes/sources";
import { fetchFeedComplete } from "./modules/feeds/actions";
import { processFeed } from "./modules/feeds/sources";
import { removeJobs } from "./modules/jobs/actions";
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
    job_id: number;
  };
}

type CableAction = UpdateFeed | UpdateEpisode | JobComplete;

export const init = (store: any) => {
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
        switch (action.type) {
          case "UPDATE_FEED": {
            const feed = camelcaseKeys(JSON.parse(action.payload.feed), {
              deep: true,
            }) as ApiFeed;
            store.dispatch(fetchFeedComplete(processFeed(feed)));
            break;
          }
          case "UPDATE_EPISODE": {
            const episode = camelcaseKeys(JSON.parse(action.payload.episode), {
              deep: true,
            }) as ApiEpisode;
            store.dispatch(fetchEpisodeComplete(processEpisode(episode)));
            break;
          }
          case "JOB_COMPLETE": {
            const jobId = action.payload.job_id;
            store.dispatch(removeJobs([jobId]));
            break;
          }
        }
      },
      disconnected: () => {},
    }
  );
};
