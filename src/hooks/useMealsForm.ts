"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MealsFormInput } from "@/types";
import { getWeekOf } from "@/lib/workout-log-helpers";

const DEFAULT_MEALS: MealsFormInput = {
  weeklyFocus: "",
  meals: [],
};

export function useMealsForm() {
  const [formData, setFormData] = useState<MealsFormInput>(DEFAULT_MEALS);
  const [weekOf, setWeekOf] = useState(() => getWeekOf());
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load from MongoDB on mount and when weekOf changes
  useEffect(() => {
    isInitialLoad.current = true;
    setLoading(true);
    setFormData(DEFAULT_MEALS);

    async function load() {
      try {
        const res = await fetch(`/api/meals?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const { weekOf: _, _id, __v, ...mealsData } = data;
            setFormData((prev) => ({ ...prev, ...mealsData }));
          }
        }
      } catch (err) {
        console.error("Failed to load meals:", err);
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
    load();
  }, [weekOf]);

  // Debounced auto-save
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/meals", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, weekOf }),
        });
      } catch (err) {
        console.error("Failed to save meals:", err);
      }
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [formData, weekOf]);

  const updateField = useCallback(
    <K extends keyof MealsFormInput>(
      field: K,
      value: MealsFormInput[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { formData, updateField, weekOf, setWeekOf, loading };
}
