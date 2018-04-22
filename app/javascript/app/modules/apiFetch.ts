export default async (url: RequestInfo, options?: RequestInit) => {
  const response = await fetch(url, options);
  return response.json();
}
