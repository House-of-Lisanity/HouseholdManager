import React from "react";
import { MealsPlanResult, DayMeals } from "@/types";
import { ViewMode } from "@/hooks/useViewMode";
import SectionPrintButton from "./SectionPrintButton";

type MealField = keyof Pick<DayMeals, "breakfast" | "lunch" | "dinner" | "snacks">;

const MEAL_SLOTS: { field: MealField; label: string }[] = [
  { field: "breakfast", label: "Breakfast" },
  { field: "lunch", label: "Lunch" },
  { field: "dinner", label: "Dinner" },
  { field: "snacks", label: "Snacks" },
];

interface MealsGridProps {
  data: MealsPlanResult;
  viewMode: ViewMode;
  selectedDayIndex: number;
  onUpdateMeal: (dayIndex: number, field: MealField, value: string) => void;
}

export default function MealsGrid({
  data,
  viewMode,
  selectedDayIndex,
  onUpdateMeal,
}: MealsGridProps) {
  const visibleDays =
    viewMode === "week" ? data.dailyMeals : [data.dailyMeals[selectedDayIndex]];
  const visibleIndices =
    viewMode === "week"
      ? data.dailyMeals.map((_, i) => i)
      : [selectedDayIndex];

  return (
    <section className="results-section results-section--meals">
      <div className="results-section__header">
        <h2>Meals</h2>
        <SectionPrintButton section="meals" label="Print Meals" />
      </div>

      <div className={`meals-grid ${viewMode === "day" ? "meals-grid--day" : ""}`}>
        {/* Day headers */}
        <div className="meals-grid__corner" />
        {visibleDays.map((day) => (
          <div key={day.day} className="meals-grid__day-header">
            {day.day}
          </div>
        ))}

        {/* Meal rows */}
        {MEAL_SLOTS.map((slot) => (
          <React.Fragment key={slot.field}>
            <div className="meals-grid__row-label">{slot.label}</div>
            {visibleDays.map((day, colOffset) => {
              const dayIndex = visibleIndices[colOffset];
              return (
                <div key={`${dayIndex}-${slot.field}`} className="meals-grid__cell">
                  <textarea
                    className="editable-field"
                    value={day[slot.field]}
                    onChange={(e) =>
                      onUpdateMeal(dayIndex, slot.field, e.target.value)
                    }
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
