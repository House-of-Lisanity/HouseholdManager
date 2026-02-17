import React, { useState } from "react";
import { MealEntry } from "@/types";
import { getTodayISO } from "@/lib/workout-log-helpers";

interface PlannedMealCardProps {
  entry: MealEntry;
  isLogged: boolean;
  onCompleteAsPlanned: (date: string) => void;
  onLogWithChanges: () => void;
}

export default function PlannedMealCard({
  entry,
  isLogged,
  onCompleteAsPlanned,
  onLogWithChanges,
}: PlannedMealCardProps) {
  const [date, setDate] = useState(getTodayISO);
  const dayLabel = entry.day || "Any Day";

  const nutritionLine = entry.nutrition
    ? [
        entry.nutrition.calories && `${entry.nutrition.calories} cal`,
        entry.nutrition.protein && `${entry.nutrition.protein}g protein`,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div
      className={`planned-meal-card${isLogged ? " planned-meal-card--logged" : ""}`}
    >
      <div className="planned-meal-card__header">
        <span className="planned-meal-card__name">{entry.mealName}</span>
        <span className="planned-meal-card__meta">
          {entry.mealSlot} &middot; {dayLabel}
        </span>
        {isLogged && <span className="badge badge--as_planned">Logged</span>}
      </div>

      {nutritionLine && (
        <p className="planned-meal-card__nutrition">{nutritionLine}</p>
      )}

      {!isLogged && (
        <div className="planned-meal-card__actions">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="planned-meal-card__date-input"
            aria-label="Completion date"
          />
          <button
            className="log-button log-button--primary"
            onClick={() => onCompleteAsPlanned(date)}
          >
            Ate as Planned
          </button>
          <button
            className="log-button log-button--secondary"
            onClick={onLogWithChanges}
          >
            Log with Changes
          </button>
        </div>
      )}
    </div>
  );
}
