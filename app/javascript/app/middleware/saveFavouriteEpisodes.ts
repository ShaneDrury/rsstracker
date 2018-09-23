import { Middleware } from "redux";
import {
  FavouritesAction,
  favouritesActions,
} from "../modules/favourites/actions";
import { getFavouritesIds } from "../modules/favourites/selectors";

const saveFavouriteEpisodes: Middleware = store => next => (
  action: FavouritesAction
) => {
  if (
    action.type === favouritesActions.FAVOURITE_ADDED ||
    action.type === favouritesActions.FAVOURITE_REMOVED
  ) {
    const result = next(action);
    const state = store.getState();
    localStorage.setItem("favourites", JSON.stringify(getFavouritesIds(state)));
    return result;
  }
  return next(action);
};

export default saveFavouriteEpisodes;
