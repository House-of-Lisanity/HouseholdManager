import React, { useState } from "react";
import { MealEntry } from "@/types";
import { DAYS_SUNDAY_START, MEAL_SLOTS } from "@/lib/constants";
import FormSection from "../shared/FormSection";
import ListItem from "../shared/ListItem";
import MealEntryForm from "../forms/MealEntryForm";

interface MealScheduleSectionProps {
  meals: MealEntry[];
  onUpdate: (meals: MealEntry[]) => void;
}

const DAY_ORDER = DAYS_SUNDAY_START.reduce(
  (acc, day, i) => {
    acc[day] = i;
    return acc;
  },
  {} as Record<string, number>
);

const SLOT_ORDER = MEAL_SLOTS.reduce(
  (acc, slot, i) => {
    acc[slot] = i;
    return acc;
  },
  {} as Record<string, number>
);

function sortMeals(meals: MealEntry[]): MealEntry[] {
  return [...meals].sort((a, b) => {
    const aHasDay = a.day !== "";
    const bHasDay = b.day !== "";
    if (aHasDay && !bHasDay) return -1;
    if (!aHasDay && bHasDay) return 1;
    if (aHasDay && bHasDay) {
      const dayDiff =
        (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99);
      if (dayDiff !== 0) return dayDiff;
    }
    return (SLOT_ORDER[a.mealSlot] ?? 99) - (SLOT_ORDER[b.mealSlot] ?? 99);
  });
}

function formatNutrition(meal: MealEntry): string | null {
  if (!meal.nutrition) return null;
  const parts: string[] = [];
  if (meal.nutrition.calories) parts.push(`${meal.nutrition.calories} cal`);
  if (meal.nutrition.protein) parts.push(`${meal.nutrition.protein}g protein`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default function MealScheduleSection({
  meals,
  onUpdate,
}: MealScheduleSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (entry: MealEntry) => {
    onUpdate([...meals, entry]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    onUpdate(meals.filter((m) => m.id !== id));
  };

  const sorted = sortMeals(meals);

  return (
    <FormSection title="Meal Schedule">
      {sorted.map((meal) => {
        const nutritionText = formatNutrition(meal);
        return (
          <ListItem
            key={meal.id}
            onRemove={() => handleRemove(meal.id)}
            className="meal-entry"
          >
            <div className="meal-entry__info">
              <strong>{meal.mealName}</strong>
              <span className="meal-entry__meta">
                {meal.mealSlot}
                {" · "}
                {meal.day || "Any Day"}
                {meal.day && meal.pinnedToDay && " (pinned)"}
              </span>
            </div>
            {nutritionText && (
              <p className="meal-entry__nutrition">{nutritionText}</p>
            )}
            {meal.notes && (
              <p className="meal-entry__notes">{meal.notes}</p>
            )}
          </ListItem>
        );
      })}

      {!showForm && (
        <button
          type="button"
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Meal
        </button>
      )}

      {showForm && (
        <MealEntryForm
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
    </FormSection>
  );
}
