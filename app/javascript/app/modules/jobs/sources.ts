import camelcaseKeys from "camelcase-keys";

import * as shortid from "shortid";
import { ApiJob, RemoteJob } from "../../types/job";
import apiFetch from "../apiFetch";

export const processJobResponse = (response: ApiJob): RemoteJob => {
  const camel: ApiJob = camelcaseKeys(response, { deep: true });
  return {
    ...camel,
    key: shortid.generate(),
    providerJobId: camel.providerJobId.toString(),
  };
};

export const getJobs = async (): Promise<RemoteJob[]> => {
  const response = await apiFetch(`/jobs`);
  return response.map(processJobResponse);
};
