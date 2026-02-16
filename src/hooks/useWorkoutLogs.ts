"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkoutLog } from "@/types";
import { getWeekOf } from "@/lib/workout-log-helpers";

export function useWorkoutLogs() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [weekOf, setWeekOf] = useState(() => getWeekOf());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/workout-logs?weekOf=${weekOf}`);
      if (!res.ok) throw new Error("Failed to load logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load workout logs:", err);
      setError("Failed to load workout logs");
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
    async (log: Omit<WorkoutLog, "_id">) => {
      try {
        setError(null);
        const res = await fetch("/api/workout-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
        if (!res.ok) throw new Error("Failed to create log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to create workout log:", err);
        setError("Failed to save workout log");
      }
    },
    [loadLogs]
  );

  const updateLog = useCallback(
    async (log: WorkoutLog) => {
      try {
        setError(null);
        const res = await fetch("/api/workout-logs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
        if (!res.ok) throw new Error("Failed to update log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to update workout log:", err);
        setError("Failed to update workout log");
      }
    },
    [loadLogs]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const res = await fetch("/api/workout-logs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete log");
        await loadLogs();
      } catch (err) {
        console.error("Failed to delete workout log:", err);
        setError("Failed to delete workout log");
      }
    },
    [loadLogs]
  );

  return { logs, weekOf, setWeekOf, loading, error, createLog, updateLog, deleteLog };
}
