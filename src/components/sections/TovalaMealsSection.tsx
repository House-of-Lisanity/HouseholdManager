import React from "react";
import { TovalaMeal } from "@/types";
import FormSection from "../shared/FormSection";

interface TovalaMealsSectionProps {
  meals: TovalaMeal[];
  onUpdate: (index: number, field: keyof TovalaMeal, value: string) => void;
}

export default function TovalaMealsSection({
  meals,
  onUpdate,
}: TovalaMealsSectionProps) {
  return (
    <FormSection
      title="Tovala Meals"
      description="List the Tovala meals you have this week. The AI will schedule them automatically."
    >
      {meals.map((meal, i) => (
        <div key={i} className="meal-entry">
          <h3>Tovala Meal #{i + 1}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Meal name (AI will schedule which day/time)"
              value={meal.mealName}
              onChange={(e) => onUpdate(i, "mealName", e.target.value)}
            />
            <input
              type="text"
              placeholder="Protein (g)"
              value={meal.protein}
              onChange={(e) => onUpdate(i, "protein", e.target.value)}
            />
            <input
              type="text"
              placeholder="Calories"
              value={meal.calories}
              onChange={(e) => onUpdate(i, "calories", e.target.value)}
            />
          </div>
        </div>
      ))}
    </FormSection>
  );
}
