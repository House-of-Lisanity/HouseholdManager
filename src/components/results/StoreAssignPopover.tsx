import React, { useEffect, useRef, useState } from "react";
import { ShoppingItem, StoreType } from "@/types";
import { STORE_CONFIGS } from "@/lib/constants";

interface StoreAssignPopoverProps {
  item: ShoppingItem;
  categories: string[];
  onToggleStore: (id: string, store: StoreType) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onClose: () => void;
}

export default function StoreAssignPopover({
  item,
  categories,
  onToggleStore,
  onUpdateCategory,
  onClose,
}: StoreAssignPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleNewCategory = () => {
    if (newCategory.trim()) {
      onUpdateCategory(item.id, newCategory.trim());
      setShowNewInput(false);
      setNewCategory("");
    }
  };

  return (
    <div className="store-popover" ref={ref}>
      <div className="store-popover__section">
        <span className="store-popover__label">Stores</span>
        {STORE_CONFIGS.map((cfg) => (
          <label key={cfg.id} className="store-popover__option">
            <input
              type="checkbox"
              checked={item.stores.includes(cfg.id)}
              onChange={() => onToggleStore(item.id, cfg.id)}
            />
            <span className={`store-popover__dot store-popover__dot--${cfg.id}`} />
            {cfg.label}
          </label>
        ))}
      </div>

      <div className="store-popover__section">
        <span className="store-popover__label">Category</span>
        <select
          className="store-popover__select"
          value={showNewInput ? "__new__" : item.category}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              setShowNewInput(true);
            } else {
              onUpdateCategory(item.id, e.target.value);
              setShowNewInput(false);
            }
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__new__">+ New category</option>
        </select>
        {showNewInput && (
          <div className="store-popover__new-cat">
            <input
              type="text"
              className="store-popover__input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewCategory()}
              placeholder="Category name"
              autoFocus
            />
            <button
              type="button"
              className="store-popover__add-btn"
              onClick={handleNewCategory}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
