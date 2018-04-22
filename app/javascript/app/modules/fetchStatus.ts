interface Success {
  status: "SUCCESS";
  url: string;
  bytesTotal: number;
}

interface Loading {
  status: "LOADING";
  bytesTransferred?: number;
  bytesTotal: number;
}

interface Failure {
  status: "FAILURE";
  errorReason: string;
}

export type FetchStatus = Success | Loading | Failure;
