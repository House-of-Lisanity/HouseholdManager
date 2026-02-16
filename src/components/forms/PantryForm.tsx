import React, { useState } from "react";
import { PantryItem } from "@/types";
import { generateId } from "@/lib/constants";

const PANTRY_CATEGORIES = [
  { value: "dry_goods", label: "Dry Goods" },
  { value: "frozen", label: "Frozen" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "spices", label: "Spices" },
] as const;

interface PantryFormProps {
  onSave: (item: PantryItem) => void;
  onCancel: () => void;
}

export default function PantryForm({ onSave, onCancel }: PantryFormProps) {
  const [item, setItem] = useState<Partial<PantryItem>>({
    category: "dry_goods",
    quantity: "",
    unit: "",
  });

  const handleSave = () => {
    if (item.name?.trim()) {
      onSave({
        ...item,
        id: generateId("pantry"),
        name: item.name.trim(),
        category: item.category || "dry_goods",
      } as PantryItem);
    }
  };

  return (
    <div className="add-form">
      <div className="form-grid">
        <input
          type="text"
          placeholder="Item name"
          value={item.name || ""}
          onChange={(e) =>
            setItem((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        <select
          value={item.category}
          onChange={(e) =>
            setItem((prev) => ({ ...prev, category: e.target.value as PantryItem["category"] }))
          }
        >
          {PANTRY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Quantity"
          value={item.quantity || ""}
          onChange={(e) =>
            setItem((prev) => ({ ...prev, quantity: e.target.value }))
          }
        />

        <input
          type="text"
          placeholder="Unit"
          value={item.unit || ""}
          onChange={(e) =>
            setItem((prev) => ({ ...prev, unit: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Expires in (days)"
          value={item.expiresInDays || ""}
          onChange={(e) =>
            setItem((prev) => ({
              ...prev,
              expiresInDays: e.target.value
                ? parseInt(e.target.value)
                : undefined,
            }))
          }
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
