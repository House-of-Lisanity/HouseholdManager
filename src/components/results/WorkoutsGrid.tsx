import React from "react";
import { WorkoutsPlanResult, WorkoutDayResult } from "@/types";
import { ViewMode } from "@/hooks/useViewMode";
import SectionPrintButton from "./SectionPrintButton";

interface WorkoutsGridProps {
  data: WorkoutsPlanResult;
  viewMode: ViewMode;
  selectedDayIndex: number;
  onUpdateSummary: (value: string) => void;
  onUpdateField: (
    dayIndex: number,
    field: keyof WorkoutDayResult,
    value: string
  ) => void;
}

function workoutBadgeClass(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("crossfit") || lower.includes("wod")) return "workout-badge--crossfit";
  if (lower.includes("lifting")) return "workout-badge--lifting";
  if (lower.includes("cardio") || lower.includes("hiit")) return "workout-badge--cardio";
  if (lower.includes("rest") || lower.includes("recovery")) return "workout-badge--rest";
  if (lower.includes("yoga") || lower.includes("stretch")) return "workout-badge--yoga";
  return "";
}

export default function WorkoutsGrid({
  data,
  viewMode,
  selectedDayIndex,
  onUpdateSummary,
  onUpdateField,
}: WorkoutsGridProps) {
  const visibleDays =
    viewMode === "week"
      ? data.dailyWorkouts
      : [data.dailyWorkouts[selectedDayIndex]];
  const visibleIndices =
    viewMode === "week"
      ? data.dailyWorkouts.map((_, i) => i)
      : [selectedDayIndex];

  return (
    <section className="results-section results-section--workouts">
      <div className="results-section__header">
        <h2>Workouts</h2>
        <SectionPrintButton section="workouts" label="Print Workouts" />
      </div>

      {data.workoutSummary && (
        <div className="results-section__summary">
          <strong>Summary:</strong>
          <textarea
            className="editable-field"
            value={data.workoutSummary}
            onChange={(e) => onUpdateSummary(e.target.value)}
            rows={2}
          />
        </div>
      )}

      <div className={`workouts-grid ${viewMode === "day" ? "workouts-grid--day" : ""}`}>
        {visibleDays.map((day, colOffset) => {
          const dayIndex = visibleIndices[colOffset];
          return (
            <div key={day.day} className="workout-card">
              <div className="workout-card__header">{day.day}</div>
              <div className="workout-card__body">
                <span className={`workout-badge ${workoutBadgeClass(day.workoutType)}`}>
                  {day.workoutType}
                </span>
                <div className="workout-card__field">
                  <strong>Location</strong>
                  <input
                    type="text"
                    className="editable-field"
                    value={day.location}
                    onChange={(e) =>
                      onUpdateField(dayIndex, "location", e.target.value)
                    }
                  />
                </div>
                {day.focusAreas && (
                  <div className="workout-card__field">
                    <strong>Focus</strong>
                    <input
                      type="text"
                      className="editable-field"
                      value={day.focusAreas}
                      onChange={(e) =>
                        onUpdateField(dayIndex, "focusAreas", e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="workout-card__field">
                  <strong>Details</strong>
                  <textarea
                    className="editable-field"
                    value={day.workoutDetails}
                    onChange={(e) =>
                      onUpdateField(dayIndex, "workoutDetails", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                {day.aiNotes && (
                  <div className="workout-card__field">
                    <strong>Notes</strong>
                    <input
                      type="text"
                      className="editable-field"
                      value={day.aiNotes}
                      onChange={(e) =>
                        onUpdateField(dayIndex, "aiNotes", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
