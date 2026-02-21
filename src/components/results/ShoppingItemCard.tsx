import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ShoppingItem, StoreType } from "@/types";
import { STORE_CONFIGS } from "@/lib/constants";
import StoreAssignPopover from "./StoreAssignPopover";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  sourceStore: StoreType | null;
  categories: string[];
  onToggleStore: (id: string, store: StoreType) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onDeleteItem: (id: string) => void;
}

export default function ShoppingItemCard({
  item,
  sourceStore,
  categories,
  onToggleStore,
  onUpdateName,
  onUpdateCategory,
  onDeleteItem,
}: ShoppingItemCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${item.id}::${sourceStore ?? "unsorted"}`,
    data: { item, sourceStore },
  });

  const otherStores = item.stores.filter((s) => s !== sourceStore);

  return (
    <div
      ref={setNodeRef}
      className={`shopping-item${isDragging ? " shopping-item--dragging" : ""}`}
      style={{ position: "relative" }}
    >
      <span className="shopping-item__grip" {...listeners} {...attributes}>
        ⠿
      </span>
      {item.quantity && (
        <span className="shopping-item__qty">{item.quantity}</span>
      )}
      <input
        type="text"
        className="shopping-item__name"
        value={item.name}
        onChange={(e) => onUpdateName(item.id, e.target.value)}
      />
      {otherStores.length > 0 && (
        <span className="shopping-item__badges">
          {otherStores.map((s) => {
            const cfg = STORE_CONFIGS.find((c) => c.id === s);
            return (
              <span key={s} className={`shopping-item__badge shopping-item__badge--${s}`}>
                {cfg?.shortLabel}
              </span>
            );
          })}
        </span>
      )}
      <button
        className="shopping-item__assign-btn"
        onClick={() => setPopoverOpen(!popoverOpen)}
        aria-label="Assign to stores"
        aria-expanded={popoverOpen}
        type="button"
      >
        ···
      </button>
      <button
        className="shopping-item__delete-btn"
        onClick={() => onDeleteItem(item.id)}
        aria-label={`Delete ${item.name}`}
        type="button"
      >
        ×
      </button>
      {popoverOpen && (
        <StoreAssignPopover
          item={item}
          categories={categories}
          onToggleStore={onToggleStore}
          onUpdateCategory={onUpdateCategory}
          onClose={() => setPopoverOpen(false)}
        />
      )}
    </div>
  );
}
