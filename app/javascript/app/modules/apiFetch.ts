export default async <R = unknown>(
  url: RequestInfo,
  options?: RequestInit
): Promise<R> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
    },
  });
  return response.json();
};
