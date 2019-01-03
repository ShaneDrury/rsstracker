export default async (url: RequestInfo, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
    },
  });
  return response.json();
};
