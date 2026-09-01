import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trip/$slug")({
  beforeLoad: ({ params, location }) => {
    // Keep the bare legacy URL pointed at the real album while child routes
    // render their own pages through this outlet.
    if (location.pathname === `/trip/${params.slug}`) {
      throw redirect({ to: "/album/$slug", params: { slug: params.slug } });
    }
  },
  component: TripLayout,
});

function TripLayout() {
  return <Outlet />;
}
