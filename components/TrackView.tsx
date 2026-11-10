"use client";

import { useEffect } from "react";
import { analytics } from "@heycatch/sdk";

/**
 * Sends one named HeyCatch event when a page is shown, for funnel steps that
 * need an event rather than a pageview (pricing_viewed on /pricing).
 */
export function TrackView({ event }: { event: string }) {
  useEffect(() => {
    analytics.trackEvent(event, { path: window.location.pathname });
  }, [event]);
  return null;
}
