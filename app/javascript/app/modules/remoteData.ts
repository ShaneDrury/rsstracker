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
