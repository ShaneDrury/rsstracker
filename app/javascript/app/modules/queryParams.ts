import * as qs from "qs";

export const updateQueryParams = (
  previous: string,
  changes: { [key: string]: string }
) => {
  const params = qs.parse(previous, {
    ignoreQueryPrefix: true,
  });
  return qs.stringify({ ...params, ...changes });
};
