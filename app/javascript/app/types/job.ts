import { Omit } from "react-redux";

export interface ApiJob {
  jobId: string;
  providerJobId: number;
  priority: number;
}

export interface RemoteJob extends Omit<ApiJob, "providerJobId"> {
  key: string;
  providerJobId: string;
}
