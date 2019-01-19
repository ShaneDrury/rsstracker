import { forEach } from "lodash";

export interface Loading<D> {
  type: "LOADING";
  data?: D;
}

export interface Success<D> {
  type: "SUCCESS";
  data: D;
}

export interface Error<E> {
  type: "FAILURE";
  error: E;
}

export type FetchStatus = "NOT_ASKED" | "LOADING" | "SUCCESS" | "FAILURE";

export const normalize = <T extends { id: string }>(things: T[]) => {
  const items: { [key: string]: T } = {};
  const ids: string[] = [];
  forEach(things, thing => {
    items[thing.id] = thing;
    ids.push(thing.id);
  });
  return {
    ids,
    items,
  };
};
