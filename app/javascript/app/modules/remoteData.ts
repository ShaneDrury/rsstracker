export interface NotAsked {
  type: "NOT_ASKED";
}

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

type RemoteDataGeneric<D, E> = NotAsked | Loading<D> | Success<D> | Error<E>;

export type RemoteData<D> = RemoteDataGeneric<D, string>;
