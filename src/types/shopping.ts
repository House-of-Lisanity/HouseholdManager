export type StoreType = "bigBox" | "warehouse" | "grocery" | "specialty";

export interface StoreConfig {
  id: StoreType;
  label: string;
  shortLabel: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  canonicalName: string;
  quantity?: string;
  form?: string;
  category: string;
  stores: StoreType[];
  notes?: string;
}

export type StoreMemoryMap = Record<string, {
  stores: StoreType[];
  category?: string;
}>;
