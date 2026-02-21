import React from "react";
import { MealsPlanResult, DayMeals, ShoppingListSection } from "@/types";
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
  onUpdateProteinTarget: (value: string) => void;
  onUpdateMeal: (dayIndex: number, field: MealField, value: string) => void;
  onUpdateShoppingItem: (
    listType: "fromPantry" | "toBuy",
    catIndex: number,
    itemIndex: number,
    value: string
  ) => void;
}

export default function MealsGrid({
  data,
  viewMode,
  selectedDayIndex,
  onUpdateProteinTarget,
  onUpdateMeal,
  onUpdateShoppingItem,
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

      <div className="results-section__summary">
        <strong>Protein Target:</strong>
        <input
          type="text"
          className="editable-field editable-field--inline"
          value={data.proteinTarget}
          onChange={(e) => onUpdateProteinTarget(e.target.value)}
        />
        <span> per day</span>
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
                    rows={2}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {data.shoppingList && (
        <div className="shopping-section">
          <h3>Shopping List</h3>
          <div className="shopping-columns">
            {(["fromPantry", "toBuy"] as const).map((listType) => (
              <div key={listType} className="shopping-column">
                <h4>{listType === "fromPantry" ? "From Pantry" : "To Buy"}</h4>
                {data.shoppingList[listType].map((section, catIndex) => (
                  <div key={catIndex} className="shopping-category">
                    <strong>{section.category}:</strong>
                    <ul>
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <input
                            type="text"
                            className="editable-field"
                            value={item}
                            onChange={(e) =>
                              onUpdateShoppingItem(
                                listType,
                                catIndex,
                                itemIndex,
                                e.target.value
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
