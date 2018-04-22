import camelcaseKeys from "camelcase-keys";
import apiFetch from "../apiFetch";
import { RemoteEpisode } from "../../types/episode";

export const getEpisodes = async(feedId: number): Promise<RemoteEpisode[]> => {
  const episodesResponse = await apiFetch(`/feeds/${feedId}/episodes`);
  return camelcaseKeys(episodesResponse)
};
