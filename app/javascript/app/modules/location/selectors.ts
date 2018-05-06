import { RootState } from "../reducers";

export const getLocation = (state: RootState) => state.routing.location;
