import camelcaseKeys from "camelcase-keys";
import qs from "qs";
import * as shortid from "shortid";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import apiFetch from "../apiFetch";
import { Filter } from "../filters";

interface EpisodesResponse {
  items: ApiEpisode[];
}

interface ProcessedResponse {
  items: RemoteEpisode[];
}

const processEpisodesResponse = (
  response: EpisodesResponse
): ProcessedResponse => {
  const camel: EpisodesResponse = camelcaseKeys(response, { deep: true });
  return {
    ...camel,
    items: camel.items.map((episode: ApiEpisode) => ({
      ...episode,
      key: shortid.generate()
    }))
  };
};

export const getEpisodes = async ({
  status,
  feedId,
  searchTerm
}: {
  status?: Filter;
  feedId?: number;
  searchTerm?: string;
}): Promise<ProcessedResponse> => {
  const queryParams = qs.stringify({
    status,
    feed_id: feedId,
    search_term: searchTerm
  });
  const episodesResponse = await apiFetch(`/episodes/search?${queryParams}`);
  return processEpisodesResponse(episodesResponse);
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
