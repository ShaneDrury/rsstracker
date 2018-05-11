import camelcaseKeys from "camelcase-keys";

import * as shortid from "shortid";
import { ApiJob, RemoteJob } from "../../types/job";
import apiFetch from "../apiFetch";

export const processJobsResponse = (response: ApiJob[]): RemoteJob[] => {
  const camel = camelcaseKeys(response, { deep: true });
  return camel.map((job: ApiJob) => ({
    ...job,
    key: shortid.generate(),
  }));
};

export const getJobs = async (): Promise<RemoteJob[]> => {
  const response = await apiFetch(`/jobs`);
  return processJobsResponse(response);
};
