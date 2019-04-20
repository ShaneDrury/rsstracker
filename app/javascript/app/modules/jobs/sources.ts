import * as shortid from "shortid";
import { ProviderJob, RemoteJob } from "../../types/job";
import apiFetch from "../apiFetch";

export const processJobResponse = (response: ProviderJob): RemoteJob => {
  const { id, attributes, ...rest } = response;
  return {
    ...rest,
    ...attributes,
    key: shortid.generate(),
    id: id.toString(),
  };
};

export const getJobs = async (): Promise<RemoteJob[]> => {
  const response = await apiFetch(`/jobs`);
  return response.map(processJobResponse);
};

export const deleteJob = async (jobId: string): Promise<void> => {
  return apiFetch(`/jobs/${jobId}`, {
    method: "DELETE",
  });
};
