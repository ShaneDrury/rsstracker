export default async (url, options = {}) => {
  const response = await fetch(url, options);
  return response.json();
}
