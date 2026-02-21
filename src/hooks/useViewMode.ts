"use client";

import { useState, useEffect } from "react";

export type ViewMode = "week" | "day";

const MOBILE_QUERY = "(max-width: 768px)";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Default to day view on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MOBILE_QUERY);
    if (mq.matches) setViewMode("day");

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setViewMode("day");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goToPrevDay = () =>
    setSelectedDayIndex((i) => Math.max(0, i - 1));

  const goToNextDay = () =>
    setSelectedDayIndex((i) => Math.min(6, i + 1));

  const goToDay = (index: number) =>
    setSelectedDayIndex(Math.max(0, Math.min(6, index)));

  return {
    viewMode,
    setViewMode,
    selectedDayIndex,
    goToPrevDay,
    goToNextDay,
    goToDay,
  };
}
