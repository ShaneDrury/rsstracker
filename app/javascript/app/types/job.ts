export interface ApiJob {
  jobId: string;
  providerJobId: number;
  priority: number;
}

export interface RemoteJob extends ApiJob {
  key: string;
}
