import camelcaseKeys from "camelcase-keys";
import apiFetch from "../apiFetch";
import { RemoteEpisode } from "../../types/episode";

export const getEpisodes = async (feedId: number): Promise<RemoteEpisode[]> => {
  const episodesResponse = await apiFetch(`/feeds/${feedId}/episodes`);
  return camelcaseKeys(episodesResponse, { deep: true })
};

export const downloadEpisode = async (episodeId: number): Promise<void> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });
