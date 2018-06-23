import { RootState } from "../reducers";

export const getAllStatusCounts = (state: RootState) =>
  state.statusCounts.items;
