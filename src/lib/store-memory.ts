import { StoreType, StoreMemoryMap } from "@/types";

const STORAGE_KEY = "weeklyPlanner_storeAssignments";

export function normalizeItemName(name: string): string {
  return name.toLowerCase().trim();
}

export function loadStoreMemory(): StoreMemoryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoreMemory(map: StoreMemoryMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function lookupStores(
  name: string,
  memory: StoreMemoryMap
): StoreType[] {
  const key = normalizeItemName(name);
  return memory[key]?.stores ?? [];
}

export function updateMemory(
  name: string,
  stores: StoreType[],
  memory: StoreMemoryMap
): StoreMemoryMap {
  const key = normalizeItemName(name);
  if (stores.length === 0) {
    const { [key]: _, ...rest } = memory;
    return rest;
  }
  return { ...memory, [key]: { stores } };
}
