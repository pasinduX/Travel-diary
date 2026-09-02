import { Auth0Provider as Provider, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { setAccessTokenGetter } from "@/lib/auth/access-token";

const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? "";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? "";
const audience = import.meta.env.VITE_AUTH0_AUDIENCE ?? "";

function Auth0TokenBridge({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setAccessTokenGetter(() =>
      getAccessTokenSilently({
        authorizationParams: { audience, scope: "openid profile email" },
      }),
    );

    return () => setAccessTokenGetter(null);
  }, [getAccessTokenSilently]);

  return children;
}

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const redirectUri =
    import.meta.env.VITE_AUTH0_REDIRECT_URI ??
    (typeof window !== "undefined" ? `${window.location.origin}/auth/auth0/callback` : "");

  return (
    <Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="memory"
      onRedirectCallback={(appState) => {
        const returnTo = appState?.returnTo;
        if (typeof returnTo === "string" && returnTo.startsWith("/")) {
          sessionStorage.setItem("auth0_return_to", returnTo);
        }
      }}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email",
      }}
    >
      <Auth0TokenBridge>{children}</Auth0TokenBridge>
    </Provider>
  );
}
