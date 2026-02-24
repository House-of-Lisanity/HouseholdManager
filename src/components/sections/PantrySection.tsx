import React, { useState } from "react";
import { PantryItem } from "@/types";
import { PANTRY_CATEGORIES } from "@/lib/constants";
import { getDefaultPantryItems } from "@/data/default-pantry-items";
import FormSection from "../shared/FormSection";
import PantryForm from "../forms/PantryForm";
import PantryCategoryGroup from "./PantryCategoryGroup";

interface PantrySectionProps {
  items: PantryItem[];
  onUpdate: (items: PantryItem[]) => void;
}

export default function PantrySection({ items, onUpdate }: PantrySectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const nonEmptyCategories = PANTRY_CATEGORIES.filter((cat) =>
    items.some((i) => i.category === cat.value)
  );

  const allCollapsed =
    nonEmptyCategories.length > 0 &&
    nonEmptyCategories.every((cat) => collapsedCategories.has(cat.value));

  const toggleCategory = (value: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allCollapsed) {
      setCollapsedCategories(new Set());
    } else {
      setCollapsedCategories(
        new Set(nonEmptyCategories.map((cat) => cat.value))
      );
    }
  };

  const handleAdd = (item: PantryItem) => {
    onUpdate([...items, item]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    onUpdate(items.filter((item) => item.id !== id));
  };

  const handleLoadDefaults = () => {
    const newItems = getDefaultPantryItems(items);
    if (newItems.length === 0) return;
    onUpdate([...items, ...newItems]);
  };

  return (
    <FormSection title="Pantry">
      {nonEmptyCategories.length > 0 && (
        <div className="pantry-controls">
          <button
            type="button"
            className="pantry-controls__toggle-all"
            onClick={toggleAll}
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </button>
        </div>
      )}

      {nonEmptyCategories.map((cat) => {
        const categoryItems = items.filter((i) => i.category === cat.value);
        return (
          <PantryCategoryGroup
            key={cat.value}
            label={cat.label}
            items={categoryItems}
            collapsed={collapsedCategories.has(cat.value)}
            onToggle={() => toggleCategory(cat.value)}
            onRemove={handleRemove}
          />
        );
      })}

      <div className="pantry-actions">
        {!showForm && (
          <button
            type="button"
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Pantry Item
          </button>
        )}
        <button
          type="button"
          className="add-button"
          onClick={handleLoadDefaults}
        >
          Load Common Items
        </button>
      </div>

      {showForm && (
        <PantryForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
      )}
    </FormSection>
  );
}
