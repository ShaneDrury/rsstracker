interface NotAsked {
  type: "NOT_ASKED";
}

interface Loading {
  type: "LOADING";
}

interface Success<D> {
  type: "SUCCESS";
  data: D;
}

interface Error<E> {
  type: "FAILURE";
  error: E;
}

export type RemoteData<D, E> = NotAsked | Loading | Success<D> | Error<E>;
