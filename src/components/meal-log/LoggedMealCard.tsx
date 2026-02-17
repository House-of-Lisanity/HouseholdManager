import React from "react";
import { MealLog } from "@/types";

const BADGE_LABELS: Record<string, string> = {
  as_planned: "As Planned",
  modified: "Modified",
  unplanned: "Unplanned",
};

interface LoggedMealCardProps {
  log: MealLog;
  onEdit: (log: MealLog) => void;
  onDelete: (id: string) => void;
}

export default function LoggedMealCard({
  log,
  onEdit,
  onDelete,
}: LoggedMealCardProps) {
  const dateLabel = new Date(log.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  const nutritionParts = [
    log.nutrition?.calories && `${log.nutrition.calories} cal`,
    log.nutrition?.protein && `${log.nutrition.protein}g protein`,
    log.nutrition?.carbs && `${log.nutrition.carbs}g carbs`,
    log.nutrition?.fat && `${log.nutrition.fat}g fat`,
  ].filter(Boolean);

  return (
    <div className="logged-meal-card">
      <div className="logged-meal-card__header">
        <span className="logged-meal-card__date">{dateLabel}</span>
        <span className={`badge badge--${log.completionType}`}>
          {BADGE_LABELS[log.completionType]}
        </span>
        <span className="logged-meal-card__meta">{log.mealSlot}</span>
      </div>

      <div className="logged-meal-card__body">
        <strong>{log.mealName}</strong>
      </div>

      {log.description && (
        <p className="logged-meal-card__description">{log.description}</p>
      )}

      {nutritionParts.length > 0 && (
        <p className="logged-meal-card__nutrition">
          {nutritionParts.join(" · ")}
        </p>
      )}

      {log.notes && (
        <p className="logged-meal-card__notes">{log.notes}</p>
      )}

      <div className="logged-meal-card__actions">
        <button
          className="log-button log-button--secondary"
          onClick={() => onEdit(log)}
          aria-label="Edit meal log"
        >
          Edit
        </button>
        <button
          className="remove-button"
          onClick={() => {
            if (log._id && window.confirm("Delete this meal log?")) {
              onDelete(log._id);
            }
          }}
          aria-label="Delete meal log"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
