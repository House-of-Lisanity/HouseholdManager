"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MealsFormInput } from "@/types";

function getCurrentWeekOf(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return monday.toISOString().split("T")[0];
}

const DEFAULT_MEALS: MealsFormInput = {
  tovalaMeals: [
    { day: "", mealName: "", protein: "", calories: "", notes: "" },
    { day: "", mealName: "", protein: "", calories: "", notes: "" },
    { day: "", mealName: "", protein: "", calories: "", notes: "" },
    { day: "", mealName: "", protein: "", calories: "", notes: "" },
  ],
  customMeals: [],
};

export function useMealsForm() {
  const [formData, setFormData] = useState<MealsFormInput>(DEFAULT_MEALS);
  const [weekOf, setWeekOf] = useState(getCurrentWeekOf);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load from MongoDB on mount
  useEffect(() => {
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
    (field: keyof MealsFormInput, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { formData, updateField, weekOf, loading };
}
