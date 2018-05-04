import camelcaseKeys from "camelcase-keys";
import { stringify } from "query-string";
import * as shortid from "shortid";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import apiFetch from "../apiFetch";
import { Filter } from "../filters";

const processEpisodesResponse = (response: ApiEpisode[]): RemoteEpisode[] => {
  const camel = camelcaseKeys(response, { deep: true });
  return camel.map((episode: ApiEpisode) => ({
    ...episode,
    key: shortid.generate()
  }));
};

export const getEpisodes = async ({
  status,
  feedId,
  searchTerm
}: {
  status?: Filter;
  feedId?: number;
  searchTerm?: string;
}): Promise<RemoteEpisode[]> => {
  const queryParams = stringify({
    status,
    feed_id: feedId,
    search_term: searchTerm
  });
  const episodesResponse = await apiFetch(`/episodes/search?${queryParams}`);
  return processEpisodesResponse(episodesResponse);
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
