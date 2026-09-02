type AccessTokenGetter = (() => Promise<string>) | null;

let getAccessToken: AccessTokenGetter = null;

export function setAccessTokenGetter(getter: AccessTokenGetter): void {
  getAccessToken = getter;
}

export async function getBrowserAccessToken(): Promise<string> {
  // Auth0 and the dashboard mount together. Give the provider bridge time to
  // register its getter before treating initialization as an auth failure.
  for (let attempt = 0; !getAccessToken && attempt < 100; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (!getAccessToken) {
    throw new Error("Auth0 is still initializing. Please try again.");
  }
  return getAccessToken();
}
