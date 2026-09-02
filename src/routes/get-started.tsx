import { createFileRoute } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/get-started")({
  head: () =>
    seo({
      title: "Get started",
      description:
        "Create a free VoyaLoom account or sign in to start turning your travel photos into a cinematic AI-built album. Free for up to 100 images and 2 trips.",
      path: "/get-started",
    }),
  component: GetStarted,
});

function GetStarted() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const started = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthenticated || started.current) return;
    started.current = true;
    void loginWithRedirect({ appState: { returnTo: "/dashboard" } });
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <div className="min-h-screen bg-midnight text-sand flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-gold" />
    </div>
  );
}
