"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type ResultSection = "calendar" | "meals" | "workouts";

interface UseSavedResultReturn<T> {
  result: T | null;
  setResult: (value: T | null) => void;
  loading: boolean;
  saveResult: (data: T) => void;
}

export function useSavedResult<T>(
  section: ResultSection,
  weekOf: string
): UseSavedResultReturn<T> {
  const [result, setResultInternal] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(true);

  // Load saved result when weekOf changes
  useEffect(() => {
    let cancelled = false;
    isLoadingRef.current = true;
    setLoading(true);
    setResultInternal(null);

    async function load() {
      try {
        const res = await fetch(
          `/api/results/${section}?weekOf=${encodeURIComponent(weekOf)}`
        );
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data) setResultInternal(data as T);
        }
      } catch (err) {
        console.error(`Failed to load ${section} result:`, err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          isLoadingRef.current = false;
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [section, weekOf]);

  // Debounced save
  const saveResult = useCallback(
    (data: T) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await fetch(`/api/results/${section}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        } catch (err) {
          console.error(`Failed to save ${section} result:`, err);
        }
      }, 1000);
    },
    [section]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // Public setter — also triggers save (unless we're still loading)
  const setResult = useCallback(
    (value: T | null) => {
      setResultInternal(value);
      if (value && !isLoadingRef.current) {
        saveResult(value);
      }
    },
    [saveResult]
  );

  return { result, setResult, loading, saveResult };
}
