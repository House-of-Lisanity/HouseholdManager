"use client";

import { useState, useEffect, useCallback } from "react";
import { RecurringTask } from "@/types";

export function useRecurringTasks() {
  const [items, setItems] = useState<RecurringTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/recurring-items?active=true");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load recurring items:", err);
      setError("Failed to load recurring items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadItems();
  }, [loadItems]);

  const createItem = useCallback(
    async (item: Omit<RecurringTask, "_id">) => {
      try {
        setError(null);
        const res = await fetch("/api/recurring-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error("Failed to create item");
        await loadItems();
      } catch (err) {
        console.error("Failed to create recurring item:", err);
        setError("Failed to save recurring item");
      }
    },
    [loadItems]
  );

  const updateItem = useCallback(
    async (item: RecurringTask) => {
      try {
        setError(null);
        const res = await fetch("/api/recurring-items", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error("Failed to update item");
        await loadItems();
      } catch (err) {
        console.error("Failed to update recurring item:", err);
        setError("Failed to update recurring item");
      }
    },
    [loadItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const res = await fetch("/api/recurring-items", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete item");
        await loadItems();
      } catch (err) {
        console.error("Failed to delete recurring item:", err);
        setError("Failed to delete recurring item");
      }
    },
    [loadItems]
  );

  const markDone = useCallback(
    async (item: RecurringTask) => {
      const updated: RecurringTask = {
        ...item,
        lastCompletedDate: new Date().toISOString().split("T")[0],
      };
      await updateItem(updated);
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
    markDone,
  };
}
