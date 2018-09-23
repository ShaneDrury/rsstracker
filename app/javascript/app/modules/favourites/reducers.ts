import { without } from "lodash";
import { FavouritesAction, favouritesActions } from "./actions";

export interface State {
  episodeIds: string[];
}

const favouritesJSON = localStorage.getItem("favourites");
const episodeIds = favouritesJSON ? JSON.parse(favouritesJSON) : [];

const initialState: State = {
  episodeIds,
};

const favourites = (
  state: State = initialState,
  action: FavouritesAction
): State => {
  switch (action.type) {
    case favouritesActions.FAVOURITE_ADDED: {
      return {
        ...state,
        episodeIds: [...state.episodeIds, action.payload.episodeId],
      };
    }
    case favouritesActions.FAVOURITE_REMOVED: {
      return {
        ...state,
        episodeIds: without(state.episodeIds, action.payload.episodeId),
      };
    }
    default:
      return state;
  }
};

export default favourites;
