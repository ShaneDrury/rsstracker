export interface ApiJob {
  providerJobId: number;
  priority: number;
}

export interface ProviderJob {
  id: number;
  priority: number;
}

export interface RemoteJob {
  key: string;
  id: string;
  priority: number;
}
