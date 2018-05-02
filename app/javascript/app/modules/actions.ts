import { RouterAction } from "react-router-redux";
import { EpisodesAction } from "./episodes/actions";
import { FeedsAction } from "./feeds/actions";

export type RootAction = FeedsAction | EpisodesAction | RouterAction;
