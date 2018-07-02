import camelcaseKeys from "camelcase-keys";
import qs from "qs";
import * as shortid from "shortid";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import { StatusCounts } from "../../types/feed";
import { ProviderJob } from "../../types/job";
import { PageInfo } from "../../types/page";
import apiFetch from "../apiFetch";
import { Status } from "../status";

interface EpisodesResponse {
  items: ApiEpisode[];
  pageInfo: PageInfo;
  statusCounts: StatusCounts;
}

interface ProcessedResponse extends EpisodesResponse {
  items: RemoteEpisode[];
}

interface DownloadEpisodeResponse {
  job: ProviderJob;
}

export const processEpisode = (episode: ApiEpisode): RemoteEpisode => ({
  ...episode,
  key: shortid.generate(),
});

const processEpisodesResponse = (
  response: EpisodesResponse
): ProcessedResponse => {
  const camel: EpisodesResponse = camelcaseKeys(response, { deep: true });
  return {
    ...camel,
    items: camel.items.map(processEpisode),
  };
};

export const getEpisodes = async (queryParams: {
  status?: Status;
  feedId?: number;
  searchTerm?: string;
  currentPage?: number;
}): Promise<ProcessedResponse> => {
  const stringified = qs.stringify({
    status: queryParams.status,
    feed_id: queryParams.feedId,
    search_term: queryParams.searchTerm,
    page_number: queryParams.currentPage,
  });
  const episodesResponse = await apiFetch(`/episodes/search?${stringified}`);
  return processEpisodesResponse(episodesResponse);
};

export const getEpisode = async (episodeId: number): Promise<RemoteEpisode> => {
  const episodeResponse: ApiEpisode = await apiFetch(`/episodes/${episodeId}`);
  const camel: ApiEpisode = camelcaseKeys(episodeResponse, { deep: true });
  return processEpisode(camel);
};

export const downloadEpisode = async (
  episodeId: number
): Promise<DownloadEpisodeResponse> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
