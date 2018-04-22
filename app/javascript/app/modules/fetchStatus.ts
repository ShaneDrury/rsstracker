interface Success {
  status: "SUCCESS";
  url: string;
  bytesTotal: number;
}

interface Loading {
  status: "LOADING";
  bytesTransferred?: number;
  bytesTotal: number;
  percentageFetched: string;
}

interface Failure {
  status: "FAILURE";
  errorReason: string;
}

interface NotAsked {
  status: "NOT_ASKED";
}

export type FetchStatus = Success | Loading | Failure | NotAsked;
