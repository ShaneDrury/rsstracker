/* eslint-disable @typescript-eslint/camelcase */
import qs from "qs";
import { ApiEpisodes, EpisodeData, RemoteEpisode } from "../../types/episode";
import { ProviderJob } from "../../types/job";
import { PageInfo } from "../../types/page";
import apiFetch from "../apiFetch";
import { Status } from "../status";

interface EpisodesResponse extends ApiEpisodes {
  meta: PageInfo;
}

export interface ProcessedResponse extends Omit<EpisodesResponse, "data"> {
  data: RemoteEpisode[];
}

export type DownloadEpisodeResponse = ProviderJob;

export const processEpisode = (episode: EpisodeData): RemoteEpisode => ({
  ...episode.attributes,
  ...episode.links,
  id: episode.id.toString(),
  updating: false,
  fetchStatus: episode.relationships.fetchStatus.data,
  feedId: episode.relationships.feed.data.id,
});

const processEpisodesResponse = (
  response: EpisodesResponse
): ProcessedResponse => {
  return {
    ...response,
    data: response.data.map(processEpisode),
  };
};

export const getEpisodes = async (queryParams: {
  status?: Status;
  feedId?: string;
  searchTerm?: string;
  currentPage?: number;
}): Promise<ProcessedResponse> => {
  const stringified = qs.stringify({
    status: queryParams.status,
    feed_id: queryParams.feedId,
    search_term: queryParams.searchTerm,
    page_number: queryParams.currentPage,
  });
  const episodesResponse: EpisodesResponse = await apiFetch(
    `/episodes/search?${stringified}`
  );
  return processEpisodesResponse(episodesResponse);
};

export const getEpisodesById = async (
  episodeIds: string[]
): Promise<RemoteEpisode[]> => {
  const episodesResponse: ApiEpisodes = await apiFetch(
    `/episodes?id[]=${episodeIds.join("&id[]=")}`
  );
  return episodesResponse.data.map(processEpisode);
};

export const downloadEpisode = async (
  episodeId: string
): Promise<DownloadEpisodeResponse> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });

export const redownloadEpisode = async (
  episodeId: string
): Promise<DownloadEpisodeResponse> =>
  apiFetch(`/episodes/${episodeId}/redownload`, { method: "POST" });

export const updateEpisodeDescription = async (
  episodeId: string,
  description: string
): Promise<void> =>
  apiFetch(`/episodes/${episodeId}`, {
    method: "PATCH",
    body: JSON.stringify({ description }),
  });

export const updateEpisodeDate = async (
  episodeId: string,
  publicationDate: string
): Promise<void> =>
  apiFetch(`/episodes/${episodeId}`, {
    method: "PATCH",
    body: JSON.stringify({ publication_date: publicationDate }),
  });

export const markEpisodeSeen = async (episodeId: string): Promise<void> =>
  apiFetch(`/episodes/${episodeId}`, {
    method: "PATCH",
    body: JSON.stringify({ seen: true }),
  });
