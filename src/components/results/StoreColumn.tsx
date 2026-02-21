import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ShoppingItem, StoreType } from "@/types";
import ShoppingItemCard from "./ShoppingItemCard";

interface StoreColumnProps {
  storeId: StoreType | null;
  label: string;
  items: ShoppingItem[];
  categories: string[];
  onToggleStore: (id: string, store: StoreType) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onAddItem: (name: string, category: string, store?: StoreType) => void;
  onDeleteItem: (id: string) => void;
}

function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const groups: Record<string, ShoppingItem[]> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

export default function StoreColumn({
  storeId,
  label,
  items,
  categories,
  onToggleStore,
  onUpdateName,
  onUpdateCategory,
  onRenameCategory,
  onAddItem,
  onDeleteItem,
}: StoreColumnProps) {
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [catDraft, setCatDraft] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: storeId ?? "unsorted",
  });

  const grouped = groupByCategory(items);
  const modifier = storeId ? `store-column--${storeId}` : "store-column--unsorted";

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const firstCat = categories[0] || "Other";
      onAddItem(newItemName, firstCat, storeId ?? undefined);
      setNewItemName("");
      setAddingItem(false);
    }
  };

  const handleCatRename = (oldName: string) => {
    if (catDraft.trim() && catDraft !== oldName) {
      onRenameCategory(oldName, catDraft);
    }
    setEditingCat(null);
  };

  return (
    <div
      ref={setNodeRef}
      className={`store-column ${modifier}${isOver ? " store-column--over" : ""}`}
    >
      <div className="store-column__header">
        <span>{label}</span>
        <span className="store-column__count">{items.length}</span>
      </div>
      <div className="store-column__body">
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="store-column__category">
            {editingCat === category ? (
              <input
                className="store-column__cat-input"
                value={catDraft}
                onChange={(e) => setCatDraft(e.target.value)}
                onBlur={() => handleCatRename(category)}
                onKeyDown={(e) => e.key === "Enter" && handleCatRename(category)}
                autoFocus
              />
            ) : (
              <button
                className="store-column__cat-label"
                onClick={() => {
                  setEditingCat(category);
                  setCatDraft(category);
                }}
                type="button"
              >
                {category}
              </button>
            )}
            {catItems.map((item) => (
              <ShoppingItemCard
                key={item.id}
                item={item}
                sourceStore={storeId}
                categories={categories}
                onToggleStore={onToggleStore}
                onUpdateName={onUpdateName}
                onUpdateCategory={onUpdateCategory}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        ))}

        {addingItem ? (
          <div className="store-column__add-row">
            <input
              className="store-column__add-input"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem();
                if (e.key === "Escape") setAddingItem(false);
              }}
              placeholder="Item name"
              autoFocus
            />
          </div>
        ) : (
          <button
            className="store-column__add-btn"
            onClick={() => setAddingItem(true)}
            type="button"
          >
            + Add item
          </button>
        )}
      </div>
    </div>
  );
}
