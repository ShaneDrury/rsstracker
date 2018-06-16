export interface ProviderJob {
  id: number;
  priority: number;
  jobData: {
    jobClass: string;
    jobId: string;
    providerJobId: string;
  };
}

export interface RemoteJob {
  key: string;
  id: string;
  priority: number;
  jobData: {
    jobClass: string;
    jobId: string;
    providerJobId: string;
  };
}
