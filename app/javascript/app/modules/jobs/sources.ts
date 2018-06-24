import camelcaseKeys from "camelcase-keys";

import * as shortid from "shortid";
import { ProviderJob, RemoteJob } from "../../types/job";
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

export const processJobResponse = (response: ProviderJob): RemoteJob => {
  const camel: ProviderJob = camelcaseKeys(response, { deep: true });
  const { id, ...rest } = camel;
  return {
    ...rest,
    key: shortid.generate(),
    id: id.toString(),
  };
};

export const getJobs = async (): Promise<RemoteJob[]> => {
  const response = await apiFetch(`/jobs`);
  return response.map(processAllJobResponse);
};

export const deleteJob = async (jobId: string): Promise<void> => {
  return apiFetch(`/jobs/${jobId}`, {
    method: "DELETE",
  });
};
