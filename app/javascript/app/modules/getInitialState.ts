import { ApiFeeds } from "../types/feed";
import { ProviderJob } from "../types/job";

interface Preloaded {
  feeds: ApiFeeds;
  jobs: ProviderJob[];
}

export const getPreloaded = (): Preloaded => {
  const element = document.getElementById("root");
  const preload = element ? element.dataset.preload : "{}";
  return preload ? JSON.parse(preload) : {};
};
