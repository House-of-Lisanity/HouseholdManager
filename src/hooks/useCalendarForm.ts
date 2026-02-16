"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CalendarFormInput } from "@/types";
import { DAYS_SUNDAY_START } from "@/lib/constants";

function getCurrentWeekOf(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return monday.toISOString().split("T")[0];
}

const DEFAULT_CALENDAR: CalendarFormInput = {
  weekOf: getCurrentWeekOf(),
  mustDo1: "",
  mustDo2: "",
  mustDo3: "",
  hobby1: "",
  hobby2: "",
  hobby3: "",
  weekendProject1: "",
  weekendProject2: "",
  weekendProject3: "",
  weekendProject1Duration: "2-4 hours",
  weekendProject2Duration: "2-4 hours",
  weekendProject3Duration: "2-4 hours",
  chore1: "",
  chore2: "",
  chore3: "",
  gymSessions: [],
  oneOffItems: [],
  recurringItems: [],
  eventNights: DAYS_SUNDAY_START.map((day) => ({
    day,
    isEvent: false,
    drinkNote: "",
  })),
  scheduleConflicts: "",
};

export function useCalendarForm() {
  const [formData, setFormData] = useState<CalendarFormInput>(DEFAULT_CALENDAR);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load from MongoDB on mount
  useEffect(() => {
    async function load() {
      try {
        const weekOf = getCurrentWeekOf();
        const res = await fetch(`/api/calendar?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          if (data) setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load calendar:", err);
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
    load();
  }, []);

  // Debounced auto-save to MongoDB
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/calendar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.error("Failed to save calendar:", err);
      }
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [formData]);

  const updateField = useCallback(
    (field: keyof CalendarFormInput, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Load a different week
  const loadWeek = useCallback(async (weekOf: string) => {
    setLoading(true);
    isInitialLoad.current = true;
    try {
      const res = await fetch(`/api/calendar?weekOf=${weekOf}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData((prev) => ({ ...prev, ...data }));
        } else {
          setFormData({ ...DEFAULT_CALENDAR, weekOf });
        }
      }
    } catch (err) {
      console.error("Failed to load week:", err);
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, []);

  return { formData, updateField, loading, loadWeek };
}
