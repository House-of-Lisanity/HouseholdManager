"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WorkoutsFormInput } from "@/types";

function getCurrentWeekOf(): string {
  const now = new Date();
  const day = now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day);
  return sunday.toISOString().split("T")[0];
}

const DEFAULT_WORKOUTS: WorkoutsFormInput = {
  weeklyFocus: "",
  workouts: [],
};

export function useWorkoutsForm() {
  const [formData, setFormData] = useState<WorkoutsFormInput>(DEFAULT_WORKOUTS);
  const [weekOf, setWeekOf] = useState(getCurrentWeekOf);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load from MongoDB on mount and when weekOf changes
  useEffect(() => {
    isInitialLoad.current = true;
    setLoading(true);
    setFormData(DEFAULT_WORKOUTS);

    async function load() {
      try {
        const res = await fetch(`/api/workouts?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const { weekOf: _, _id, __v, ...workoutsData } = data;
            setFormData((prev) => ({ ...prev, ...workoutsData }));
          }
        }
      } catch (err) {
        console.error("Failed to load workouts:", err);
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
        await fetch("/api/workouts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, weekOf }),
        });
      } catch (err) {
        console.error("Failed to save workouts:", err);
      }
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [formData, weekOf]);

  const updateField = useCallback(
    <K extends keyof WorkoutsFormInput>(
      field: K,
      value: WorkoutsFormInput[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { formData, updateField, weekOf, setWeekOf, loading };
}
