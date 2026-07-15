"use client";

import { useEffect } from "react";

/**
 * Prevents body scroll when `locked` is true.
 *
 * Sets `overflow: hidden` on `document.body` while locked and restores
 * the original overflow value when the lock is released or the
 * component unmounts.
 *
 * @param locked - Whether body scroll should be locked.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
