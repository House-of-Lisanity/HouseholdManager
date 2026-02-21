import React, { useState } from "react";
import { MealsPlanResult, DayMeals, ShoppingListSection } from "@/types";

interface MealsResultsProps {
  result: MealsPlanResult;
  onBack: () => void;
}

type MealField = keyof Pick<DayMeals, "breakfast" | "lunch" | "dinner" | "snacks">;

export default function MealsResults({ result, onBack }: MealsResultsProps) {
  const [data, setData] = useState<MealsPlanResult>(result);

  const updateMeal = (dayIndex: number, field: MealField, value: string) => {
    setData((prev) => ({
      ...prev,
      dailyMeals: prev.dailyMeals.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  const updateShoppingItem = (
    listType: "fromPantry" | "toBuy",
    catIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setData((prev) => {
      const list: ShoppingListSection[] = prev.shoppingList[listType].map(
        (section, ci) =>
          ci === catIndex
            ? {
                ...section,
                items: section.items.map((item, ii) =>
                  ii === itemIndex ? value : item
                ),
              }
            : section
      );
      return {
        ...prev,
        shoppingList: { ...prev.shoppingList, [listType]: list },
      };
    });
  };

  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Meal Plan</h2>
        <p>Week of {data.weekOf}</p>
      </div>

      <div className="plan-summary">
        <strong>Protein Target:</strong>
        <input
          type="text"
          className="editable-field"
          value={data.proteinTarget}
          onChange={(e) =>
            setData((prev) => ({ ...prev, proteinTarget: e.target.value }))
          }
        />
        <span> per day</span>
      </div>

      {data.dailyMeals.map((dayMeals, dayIndex) => (
        <div key={dayIndex} className="day-section">
          <h3 className="day-header">{dayMeals.day}</h3>
          <div className="day-content">
            <div className="meals-column">
              <div className="meals-list">
                {(["breakfast", "lunch", "dinner", "snacks"] as MealField[]).map(
                  (field) => (
                    <div key={field} className="meal-row">
                      <strong>
                        {field === "breakfast"
                          ? "B"
                          : field === "lunch"
                            ? "L"
                            : field === "dinner"
                              ? "D"
                              : "Snacks"}
                        :
                      </strong>
                      <textarea
                        className="editable-field"
                        value={dayMeals[field]}
                        onChange={(e) =>
                          updateMeal(dayIndex, field, e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

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
                              updateShoppingItem(
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

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Back to Form
        </button>
        <button
          className="print-button"
          onClick={() => window.print()}
          aria-label="Print meal plan"
        >
          Print
        </button>
      </div>
    </div>
  );
}
