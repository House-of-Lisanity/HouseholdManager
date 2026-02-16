import React from "react";
import { WorkoutLog } from "@/types";

const BADGE_LABELS: Record<string, string> = {
  as_planned: "As Planned",
  modified: "Modified",
  unplanned: "Unplanned",
};

interface LoggedWorkoutCardProps {
  log: WorkoutLog;
  onEdit: (log: WorkoutLog) => void;
  onDelete: (id: string) => void;
}

export default function LoggedWorkoutCard({
  log,
  onEdit,
  onDelete,
}: LoggedWorkoutCardProps) {
  const dateLabel = new Date(log.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  return (
    <div className="logged-workout-card">
      <div className="logged-workout-card__header">
        <span className="logged-workout-card__date">{dateLabel}</span>
        <span className={`badge badge--${log.completionType}`}>
          {BADGE_LABELS[log.completionType]}
        </span>
        {log.duration && (
          <span className="logged-workout-card__meta">{log.duration} min</span>
        )}
        {log.rpe && (
          <span className="logged-workout-card__meta">RPE {log.rpe}</span>
        )}
      </div>

      <div className="logged-workout-card__body">
        <strong>{log.workoutType}</strong> &middot; {log.location}
      </div>

      {log.exercises.length > 0 && (
        <ul className="logged-workout-card__exercises">
          {log.exercises.map((ex, i) => (
            <li key={i}>
              {ex.exerciseName || "Unnamed exercise"} &mdash; {ex.sets.length}{" "}
              {ex.sets.length === 1 ? "set" : "sets"}
            </li>
          ))}
        </ul>
      )}

      {log.rawDetails && (
        <p className="logged-workout-card__details">{log.rawDetails}</p>
      )}

      {log.notes && (
        <p className="logged-workout-card__notes">{log.notes}</p>
      )}

      <div className="logged-workout-card__actions">
        <button
          className="log-button log-button--secondary"
          onClick={() => onEdit(log)}
          aria-label="Edit workout log"
        >
          Edit
        </button>
        <button
          className="remove-button"
          onClick={() => {
            if (log._id && window.confirm("Delete this workout log?")) {
              onDelete(log._id);
            }
          }}
          aria-label="Delete workout log"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
