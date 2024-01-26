export function getAccessToken(): string | undefined {
  return localStorage.getItem('access_token') || undefined;
}

export function getRefreshToken(): string | undefined {
  return localStorage.getItem('refresh_token') || undefined;
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
