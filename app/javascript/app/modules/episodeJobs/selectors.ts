import { RootState } from "../reducers";

export const getEpisodeJobs = (state: RootState) => state.episodeJobs.items;
