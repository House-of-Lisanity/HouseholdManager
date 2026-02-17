import { TodoItem, RecurringTask, TodoCategory } from "@/types";
import { TODO_CATEGORIES, HOME_ROOMS } from "@/lib/constants";

export type SortField = "title" | "subcategory" | "location";
export type SortDirection = "asc" | "desc";

export function groupByCategory(
  items: TodoItem[]
): Map<string, TodoItem[]> {
  const map = new Map<string, TodoItem[]>();
  for (const item of items) {
    const list = map.get(item.category) || [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}

export function sortItems(
  items: TodoItem[],
  field: SortField,
  direction: SortDirection
): TodoItem[] {
  return [...items].sort((a, b) => {
    const aVal = (a[field] || "").toLowerCase();
    const bVal = (b[field] || "").toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return direction === "asc" ? cmp : -cmp;
  });
}

/** Collect all unique categories from items, merged with preset defaults */
export function getUniqueCategories(items: TodoItem[]): string[] {
  const preset = new Set<string>(TODO_CATEGORIES);
  for (const item of items) {
    preset.add(item.category);
  }
  return Array.from(preset);
}

/** Collect all unique rooms from items, merged with preset defaults */
export function getUniqueRooms(items: TodoItem[]): string[] {
  const preset = new Set<string>(HOME_ROOMS);
  for (const item of items) {
    if (item.subcategory) preset.add(item.subcategory);
  }
  return Array.from(preset);
}

export function createEmptyTodoItem(): Omit<TodoItem, "_id"> {
  return {
    title: "",
    notes: "",
    category: "Home",
    isProject: false,
    completed: false,
  };
}

export function createEmptyRecurringTask(): Omit<RecurringTask, "_id"> {
  return {
    title: "",
    notes: "",
    category: "Home",
    frequency: "weekly",
    active: true,
  };
}

export function daysSinceCompletion(lastCompletedDate?: string): number | null {
  if (!lastCompletedDate) return null;
  const last = new Date(lastCompletedDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function isDue(item: RecurringTask): boolean {
  const days = daysSinceCompletion(item.lastCompletedDate);
  if (days === null) return true;

  const thresholds: Record<string, number> = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    quarterly: 90,
  };

  return days >= (thresholds[item.frequency] || 7);
}
