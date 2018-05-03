import camelcaseKeys from "camelcase-keys";
import { stringify } from "query-string";
import * as shortid from "shortid";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import apiFetch from "../apiFetch";
import { Filter } from "../filters";

export const getEpisodes = async (
  status: Filter,
  feedId: number
): Promise<RemoteEpisode[]> => {
  const queryParams = stringify({ status });
  const episodesResponse = await apiFetch(
    `/feeds/${feedId}/episodes?${queryParams}`
  );
  const camel = camelcaseKeys(episodesResponse, { deep: true });
  return camel.map((episode: ApiEpisode) => ({
    ...episode,
    key: shortid.generate()
  }));
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
