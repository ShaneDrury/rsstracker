/* eslint-disable @typescript-eslint/camelcase */
import camelcaseKeys from "camelcase-keys";
import qs from "qs";
import { ApiEpisode, RemoteEpisode } from "../../types/episode";
import { ProviderJob } from "../../types/job";
import { PageInfo } from "../../types/page";
import { Omit } from "../../types/util";
import apiFetch from "../apiFetch";
import { Status } from "../status";

interface EpisodesResponse {
  items: ApiEpisode[];
  pageInfo: PageInfo;
}

interface ProcessedResponse extends Omit<EpisodesResponse, "items"> {
  items: RemoteEpisode[];
}

interface DownloadEpisodeResponse {
  job: ProviderJob;
}

export const processEpisode = (episode: ApiEpisode): RemoteEpisode => ({
  ...episode,
  id: episode.id.toString(),
  updating: false,
});

const processEpisodesResponse = (
  response: EpisodesResponse
): ProcessedResponse => {
  const camel = camelcaseKeys(response, { deep: true }) as EpisodesResponse;
  return {
    ...camel,
    items: camel.items.map(processEpisode),
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
  const episodesResponse = await apiFetch(`/episodes/search?${stringified}`);
  return processEpisodesResponse(episodesResponse);
};

export const getEpisodesById = async (
  episodeIds: string[]
): Promise<RemoteEpisode[]> => {
  const episodesResponse: ApiEpisode[] = await apiFetch(
    `/episodes?id[]=${episodeIds.join("&id[]=")}`
  );
  const camelEpisodes = camelcaseKeys(episodesResponse, {
    deep: true,
  }) as ApiEpisode[];
  return camelEpisodes.map(processEpisode);
};

export const downloadEpisode = async (
  episodeId: string
): Promise<DownloadEpisodeResponse> =>
  apiFetch(`/episodes/${episodeId}/download`, { method: "POST" });

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
