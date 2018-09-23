export enum favouritesActions {
  FAVOURITE_ADDED = "FAVOURITE_ADDED",
  FAVOURITE_REMOVED = "FAVOURITE_REMOVED",
}

interface FavouriteAdded {
  type: favouritesActions.FAVOURITE_ADDED;
  payload: { episodeId: string };
}

interface FavouriteRemoved {
  type: favouritesActions.FAVOURITE_REMOVED;
  payload: { episodeId: string };
}

export type FavouritesAction = FavouriteAdded | FavouriteRemoved;

export const favouriteAdded = (episodeId: string): FavouriteAdded => ({
  type: favouritesActions.FAVOURITE_ADDED,
  payload: { episodeId },
});

export const favouriteRemoved = (episodeId: string): FavouriteRemoved => ({
  type: favouritesActions.FAVOURITE_REMOVED,
  payload: { episodeId },
});
