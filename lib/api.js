import { API_BASE_URL } from "./config";

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function createAuthHeaders(accessToken, extraHeaders = {}) {
  return {
    ...extraHeaders,
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function readErrorMessage(response, fallbackMessage) {
  const message = await response.text();
  return message || fallbackMessage;
}
