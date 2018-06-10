import camelcaseKeys from "camelcase-keys";

import * as shortid from "shortid";
import { ApiJob, ProviderJob, RemoteJob } from "../../types/job";
import apiFetch from "../apiFetch";

export const processAllJobResponse = (response: ProviderJob): RemoteJob => {
  const camel: ProviderJob = camelcaseKeys(response, { deep: true });
  const { id, ...rest } = camel;
  return {
    ...rest,
    key: shortid.generate(),
    id: id.toString(10),
  };
};

export const processJobResponse = (response: ApiJob): RemoteJob => {
  const camel: ApiJob = camelcaseKeys(response, { deep: true });
  const { providerJobId, ...rest } = camel;
  return {
    ...rest,
    key: shortid.generate(),
    id: providerJobId.toString(),
  };
};

export const getJobs = async (): Promise<RemoteJob[]> => {
  const response = await apiFetch(`/jobs`);
  return response.map(processAllJobResponse);
};
