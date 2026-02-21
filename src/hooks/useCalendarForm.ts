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
  oneOffItems: [],
  recurringItems: [],
  eventNights: DAYS_SUNDAY_START.map((day) => ({
    day,
    isEvent: false,
    drinkNote: "",
  })),
  weeklyNotes: "",
};

export function useCalendarForm() {
  const [formData, setFormData] = useState<CalendarFormInput>(DEFAULT_CALENDAR);
  const [weekOf, setWeekOf] = useState(getCurrentWeekOf);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load from MongoDB on mount and when weekOf changes
  useEffect(() => {
    isInitialLoad.current = true;
    setLoading(true);
    setFormData({ ...DEFAULT_CALENDAR, weekOf });

    async function load() {
      try {
        const res = await fetch(`/api/calendar?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const { weekOf: _, _id, __v, ...calendarData } = data;
            setFormData((prev) => ({ ...prev, ...calendarData }));
          }
        }
      } catch (err) {
        console.error("Failed to load calendar:", err);
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
        await fetch("/api/calendar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, weekOf }),
        });
      } catch (err) {
        console.error("Failed to save calendar:", err);
      }
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [formData, weekOf]);

  const updateField = useCallback(
    (field: keyof CalendarFormInput, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { formData, updateField, weekOf, setWeekOf, loading };
}
