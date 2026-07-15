"use client";

import { useCallback } from "react";
import { track } from "@/lib/events";

/**
 * Wraps an onClick handler with analytics tracking.
 *
 * Fires a `button_click` event when the wrapped handler is called,
 * passing the tracking label and variant as event payload.
 *
 * @param onClick - Optional original click handler to wrap.
 * @param trackingLabel - Label sent as the event label (required for tracking to fire).
 * @param variant - Button variant sent with the event (defaults to "primary").
 * @returns A memoized click handler that calls onClick then fires the tracking event.
 */
export function useButtonTracking(
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  trackingLabel?: string,
  variant?: string
): React.MouseEventHandler<HTMLButtonElement> {
  return useCallback(
    (event) => {
      onClick?.(event);

      if (trackingLabel && !event.defaultPrevented) {
        track.event("button_click", {
          label: trackingLabel,
          variant: variant ?? "primary",
        });
      }
    },
    [onClick, trackingLabel, variant]
  );
}
