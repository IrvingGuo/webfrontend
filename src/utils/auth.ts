const tokenKey = 'token';
export const tokenHeaderKey = 'Authorization';

export function getToken(): string {
  const token = localStorage.getItem(tokenKey);
  return token === null ? '' : token;
}

export function setToken(token: string) {
  return localStorage.setItem(tokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(tokenKey);
}
