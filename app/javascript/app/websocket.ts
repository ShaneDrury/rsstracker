import Cable from "actioncable";
import camelcaseKeys from "camelcase-keys";
import { fetchFeedComplete } from "./modules/feeds/actions";
import { processFeed } from "./modules/feeds/sources";
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

type CableAction = UpdateFeed;

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
          }
        }
      },
      disconnected: () => {},
    }
  );
};
