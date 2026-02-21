"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ShoppingListSection, ShoppingItem, StoreType, StoreMemoryMap } from "@/types";
import { generateId } from "@/lib/constants";
import {
  loadStoreMemory,
  saveStoreMemory,
  lookupStores,
  updateMemory,
} from "@/lib/store-memory";

function buildItems(
  toBuy: ShoppingListSection[],
  memory: StoreMemoryMap
): ShoppingItem[] {
  const items: ShoppingItem[] = [];
  for (const section of toBuy) {
    for (const ingredient of section.items) {
      const canonicalName = ingredient.name.toLowerCase().trim();
      const displayName = ingredient.form
        ? `${ingredient.form} ${ingredient.name}`
        : ingredient.name;
      items.push({
        id: generateId("item"),
        name: displayName,
        canonicalName,
        quantity: ingredient.quantity,
        form: ingredient.form,
        category: section.category,
        stores: lookupStores(canonicalName, memory),
        notes: ingredient.notes,
      });
    }
  }
  return items;
}

export function useShoppingList(toBuy: ShoppingListSection[]) {
  const memoryRef = useRef<StoreMemoryMap>({});
  const [items, setItems] = useState<ShoppingItem[]>([]);

  // Initialize once on mount
  useEffect(() => {
    const mem = loadStoreMemory();
    memoryRef.current = mem;
    setItems(buildItems(toBuy, mem));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persistMemory = useCallback((updatedItems: ShoppingItem[]) => {
    let mem = memoryRef.current;
    for (const item of updatedItems) {
      mem = updateMemory(item.canonicalName, item.stores, mem);
    }
    memoryRef.current = mem;
    saveStoreMemory(mem);
  }, []);

  const updateItem = useCallback(
    (id: string, updater: (item: ShoppingItem) => ShoppingItem) => {
      setItems((prev) => {
        const next = prev.map((item) => (item.id === id ? updater(item) : item));
        const changed = next.find((item) => item.id === id);
        if (changed) persistMemory([changed]);
        return next;
      });
    },
    [persistMemory]
  );

  const assignStore = useCallback(
    (id: string, store: StoreType) =>
      updateItem(id, (item) =>
        item.stores.includes(store)
          ? item
          : { ...item, stores: [...item.stores, store] }
      ),
    [updateItem]
  );

  const unassignStore = useCallback(
    (id: string, store: StoreType) =>
      updateItem(id, (item) => ({
        ...item,
        stores: item.stores.filter((s) => s !== store),
      })),
    [updateItem]
  );

  const toggleStore = useCallback(
    (id: string, store: StoreType) =>
      updateItem(id, (item) =>
        item.stores.includes(store)
          ? { ...item, stores: item.stores.filter((s) => s !== store) }
          : { ...item, stores: [...item.stores, store] }
      ),
    [updateItem]
  );

  const moveToStore = useCallback(
    (id: string, fromStore: StoreType | null, toStore: StoreType | null) => {
      updateItem(id, (item) => {
        let stores = fromStore
          ? item.stores.filter((s) => s !== fromStore)
          : [...item.stores];
        if (toStore && !stores.includes(toStore)) {
          stores = [...stores, toStore];
        }
        return { ...item, stores };
      });
    },
    [updateItem]
  );

  const updateItemName = useCallback(
    (id: string, name: string) =>
      updateItem(id, (item) => ({ ...item, name })),
    [updateItem]
  );

  const updateItemCategory = useCallback(
    (id: string, category: string) =>
      updateItem(id, (item) => ({ ...item, category })),
    [updateItem]
  );

  const renameCategory = useCallback(
    (oldName: string, newName: string) => {
      if (!newName.trim() || oldName === newName) return;
      setItems((prev) =>
        prev.map((item) =>
          item.category === oldName ? { ...item, category: newName.trim() } : item
        )
      );
    },
    []
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    []
  );

  const addItem = useCallback(
    (name: string, category: string, store?: StoreType) => {
      if (!name.trim()) return;
      const trimmed = name.trim();
      const newItem: ShoppingItem = {
        id: generateId("item"),
        name: trimmed,
        canonicalName: trimmed.toLowerCase(),
        category,
        stores: store ? [store] : [],
      };
      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  const unsortedItems = useMemo(
    () => items.filter((item) => item.stores.length === 0),
    [items]
  );

  const itemsByStore = useMemo(() => {
    const map: Record<StoreType, ShoppingItem[]> = {
      bigBox: [],
      warehouse: [],
      grocery: [],
      specialty: [],
    };
    for (const item of items) {
      for (const store of item.stores) {
        map[store].push(item);
      }
    }
    return map;
  }, [items]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items]
  );

  return {
    items,
    unsortedItems,
    itemsByStore,
    categories,
    assignStore,
    unassignStore,
    toggleStore,
    moveToStore,
    updateItemName,
    updateItemCategory,
    renameCategory,
    addItem,
    deleteItem,
  };
}
