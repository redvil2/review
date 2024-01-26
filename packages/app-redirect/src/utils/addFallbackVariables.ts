import { URL } from 'url';

export function addFallbackVariables(url, { projectId, orderId }) {
  if (!url) return url;

  const parsedUrl = new URL(url);

  parsedUrl.searchParams.set('projectId', projectId);
  parsedUrl.searchParams.set('orderId', orderId);

  return parsedUrl.toString();
}
