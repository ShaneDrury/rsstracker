import camelcaseKeys from "camelcase-keys";
import apiFetch from "../apiFetch";
import { RemoteEpisode } from "../../types/episode";
import { Filter } from "../filters";
import { stringify } from "query-string";

export const getEpisodes = async (status: Filter, feedId: number): Promise<RemoteEpisode[]> => {
  const queryParams = stringify({ status });
  const episodesResponse = await apiFetch(`/feeds/${feedId}/episodes?${queryParams}`);
  return camelcaseKeys(episodesResponse, { deep: true })
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
