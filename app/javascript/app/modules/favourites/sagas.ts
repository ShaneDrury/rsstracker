import { without } from "lodash";
import { all, take } from "redux-saga/effects";
import { FavouriteAdded, favouritesActions } from "./actions";

const getFavourites = (): string[] => {
  const favouritesJSON = localStorage.getItem("favourites");
  return favouritesJSON ? JSON.parse(favouritesJSON) : [];
};

function addFavourite(episodeId: string) {
  const favourites = getFavourites();
  localStorage.setItem(
    "favourites",
    JSON.stringify([...favourites, episodeId])
  );
}

function* watchFavouriteAdded() {
  while (true) {
    const {
      payload: { episodeId },
    }: FavouriteAdded = yield take(favouritesActions.FAVOURITE_ADDED);
    addFavourite(episodeId);
  }
}

function removeFavourite(episodeId: string) {
  const favourites = getFavourites();
  localStorage.setItem(
    "favourites",
    JSON.stringify(without(favourites, episodeId))
  );
}

function* watchFavouriteRemoved() {
  while (true) {
    const {
      payload: { episodeId },
    }: FavouriteAdded = yield take(favouritesActions.FAVOURITE_REMOVED);
    removeFavourite(episodeId);
  }
}

export function* favouritesSagas() {
  yield all([watchFavouriteAdded(), watchFavouriteRemoved()]);
}
