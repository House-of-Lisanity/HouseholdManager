"use client";

import { useState, useEffect, useCallback } from "react";
import { MealLog } from "@/types";
import { getWeekOf } from "@/lib/workout-log-helpers";

export function useMealLogs() {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [weekOf, setWeekOf] = useState(() => getWeekOf());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/meal-logs?weekOf=${weekOf}`);
      if (!res.ok) throw new Error("Failed to load logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load meal logs:", err);
      setError("Failed to load meal logs");
    } finally {
      setLoading(false);
    }
  }, [weekOf]);

  useEffect(() => {
    setLoading(true);
    setLogs([]);
    loadLogs();
  }, [loadLogs]);

  const createLog = useCallback(
    async (log: Omit<MealLog, "_id">) => {
      try {
        setError(null);
        const res = await fetch("/api/meal-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
        if (!res.ok) throw new Error("Failed to create log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to create meal log:", err);
        setError("Failed to save meal log");
      }
    },
    [loadLogs]
  );

  const updateLog = useCallback(
    async (log: MealLog) => {
      try {
        setError(null);
        const res = await fetch("/api/meal-logs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
        if (!res.ok) throw new Error("Failed to update log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to update meal log:", err);
        setError("Failed to update meal log");
      }
    },
    [loadLogs]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const res = await fetch("/api/meal-logs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to delete meal log:", err);
        setError("Failed to delete meal log");
      }
    },
    [loadLogs]
  );

  return { logs, weekOf, setWeekOf, loading, error, createLog, updateLog, deleteLog };
}
