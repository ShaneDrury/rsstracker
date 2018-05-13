import { RootState } from "../reducers";

export const getFeedJobs = (state: RootState) => state.feedJobs.items;
