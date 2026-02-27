"use client";

import { useState, useEffect, useCallback } from "react";
import { TodoItem, WeeklyPriority } from "@/types";
import { getWeekOf } from "@/lib/workout-log-helpers";

export function useTodos() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/todos?completed=false");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load to-do items:", err);
      setError("Failed to load to-do items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadItems();
  }, [loadItems]);

  const createItem = useCallback(
    async (item: Omit<TodoItem, "_id">) => {
      try {
        setError(null);
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error("Failed to create item");
        await loadItems();
      } catch (err) {
        console.error("Failed to create to-do item:", err);
        setError("Failed to save to-do item");
      }
    },
    [loadItems]
  );

  const updateItem = useCallback(
    async (item: TodoItem) => {
      try {
        setError(null);
        const res = await fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error("Failed to update item");
        await loadItems();
      } catch (err) {
        console.error("Failed to update to-do item:", err);
        setError("Failed to update to-do item");
      }
    },
    [loadItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const res = await fetch("/api/todos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete item");
        await loadItems();
      } catch (err) {
        console.error("Failed to delete to-do item:", err);
        setError("Failed to delete to-do item");
      }
    },
    [loadItems]
  );

  const toggleComplete = useCallback(
    async (item: TodoItem) => {
      const nowCompleting = !item.completed;
      const updated: TodoItem = {
        ...item,
        completed: nowCompleting,
        completedAt: nowCompleting ? new Date().toISOString() : undefined,
        ...(nowCompleting
          ? { weeklyPriority: undefined, weeklyHoursMax: undefined, taggedForWeek: undefined }
          : {}),
      };
      await updateItem(updated);
    },
    [updateItem]
  );

  const setWeeklyTag = useCallback(
    async (
      item: TodoItem,
      priority: WeeklyPriority | undefined,
      hoursMax?: number
    ) => {
      const weekOf = getWeekOf();
      const updated = {
        ...item,
        weeklyPriority: priority ?? null,
        weeklyHoursMax: priority ? (hoursMax ?? null) : null,
        taggedForWeek: priority ? weekOf : null,
      };
      await updateItem(updated as TodoItem);
    },
    [updateItem]
  );

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    toggleComplete,
    setWeeklyTag,
  };
}
