import camelcaseKeys from "camelcase-keys";
import qs from "qs";
import * as shortid from "shortid";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import { PageInfo } from "../../types/page";
import apiFetch from "../apiFetch";
import { Filter } from "../filters";

interface EpisodesResponse {
  items: ApiEpisode[];
  pageInfo: PageInfo;
}

interface ProcessedResponse extends EpisodesResponse {
  items: RemoteEpisode[];
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

export const getEpisodes = async ({
  status,
  feedId,
  searchTerm,
  currentPage,
}: {
  status?: Filter;
  feedId?: number;
  searchTerm?: string;
  currentPage?: number;
}): Promise<ProcessedResponse> => {
  const queryParams = qs.stringify({
    status,
    feed_id: feedId,
    search_term: searchTerm,
    page_number: currentPage,
  });
  const episodesResponse = await apiFetch(`/episodes/search?${queryParams}`);
  return processEpisodesResponse(episodesResponse);
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
