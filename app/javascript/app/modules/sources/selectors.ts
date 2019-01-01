import { Source } from "../../types/feed";
import { RootState } from "../reducers";

export const getSourceObjects = (state: RootState): { [key: string]: Source } =>
  state.sources.items;
