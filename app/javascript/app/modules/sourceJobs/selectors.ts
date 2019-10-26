import { RootState } from "../reducers";

export const getSourceJobs = (state: RootState) => state.sourceJobs.items;
