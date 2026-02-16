import React from "react";
import { MealsPlanResult } from "@/types";

interface MealsResultsProps {
  result: MealsPlanResult;
  onBack: () => void;
}

export default function MealsResults({ result, onBack }: MealsResultsProps) {
  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Meal Plan</h2>
        <p>Week of {result.weekOf}</p>
      </div>

      <div className="plan-summary">
        <p>
          <strong>Protein Target:</strong> {result.proteinTarget} per day
        </p>
      </div>

      {result.dailyMeals.map((dayMeals, i) => (
        <div key={i} className="day-section">
          <h3 className="day-header">{dayMeals.day}</h3>
          <div className="day-content">
            <div className="meals-column">
              <div className="meals-list">
                <div className="meal-row">
                  <strong>B:</strong>
                  <textarea
                    className="editable-field"
                    defaultValue={dayMeals.breakfast}
                    rows={2}
                  />
                </div>
                <div className="meal-row">
                  <strong>L:</strong>
                  <textarea
                    className="editable-field"
                    defaultValue={dayMeals.lunch}
                    rows={2}
                  />
                </div>
                <div className="meal-row">
                  <strong>D:</strong>
                  <textarea
                    className="editable-field"
                    defaultValue={dayMeals.dinner}
                    rows={2}
                  />
                </div>
                <div className="meal-row">
                  <strong>Snacks:</strong>
                  <textarea
                    className="editable-field"
                    defaultValue={dayMeals.snacks}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {result.shoppingList && (
        <div className="shopping-section">
          <h3>Shopping List</h3>
          <div className="shopping-columns">
            <div className="shopping-column">
              <h4>From Pantry</h4>
              {result.shoppingList.fromPantry.map((section, i) => (
                <div key={i} className="shopping-category">
                  <strong>{section.category}:</strong>
                  <ul>
                    {section.items.map((item, j) => (
                      <li key={j}>
                        <input
                          type="text"
                          className="editable-field"
                          defaultValue={item}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="shopping-column">
              <h4>To Buy</h4>
              {result.shoppingList.toBuy.map((section, i) => (
                <div key={i} className="shopping-category">
                  <strong>{section.category}:</strong>
                  <ul>
                    {section.items.map((item, j) => (
                      <li key={j}>
                        <input
                          type="text"
                          className="editable-field"
                          defaultValue={item}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button className="new-plan-button" onClick={onBack}>
        Back to Form
      </button>
    </div>
  );
}
