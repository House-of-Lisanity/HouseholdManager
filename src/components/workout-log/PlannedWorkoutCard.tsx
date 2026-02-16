import React, { useState } from "react";
import { WorkoutEntry } from "@/types";
import { getTodayISO } from "@/lib/workout-log-helpers";

interface PlannedWorkoutCardProps {
  entry: WorkoutEntry;
  isLogged: boolean;
  onCompleteAsPlanned: (date: string) => void;
  onLogWithChanges: () => void;
}

export default function PlannedWorkoutCard({
  entry,
  isLogged,
  onCompleteAsPlanned,
  onLogWithChanges,
}: PlannedWorkoutCardProps) {
  const [date, setDate] = useState(getTodayISO);
  const dayLabel = entry.day || "Any Day";

  return (
    <div className={`planned-workout-card${isLogged ? " planned-workout-card--logged" : ""}`}>
      <div className="planned-workout-card__header">
        <span className="planned-workout-card__type">{entry.workoutType}</span>
        <span className="planned-workout-card__meta">
          {entry.location} &middot; {dayLabel}
        </span>
        {isLogged && <span className="badge badge--as_planned">Logged</span>}
      </div>

      {entry.details && (
        <p className="planned-workout-card__details">{entry.details}</p>
      )}

      {!isLogged && (
        <div className="planned-workout-card__actions">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="planned-workout-card__date-input"
            aria-label="Completion date"
          />
          <button
            className="log-button log-button--primary"
            onClick={() => onCompleteAsPlanned(date)}
          >
            Complete as Planned
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
