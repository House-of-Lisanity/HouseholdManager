import React from "react";
import { WorkoutsPlanResult } from "@/types";

interface WorkoutsResultsProps {
  result: WorkoutsPlanResult;
  onBack: () => void;
}

export default function WorkoutsResults({
  result,
  onBack,
}: WorkoutsResultsProps) {
  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Workout Plan</h2>
        <p>Week of {result.weekOf}</p>
      </div>

      {result.workoutSummary && (
        <div className="plan-summary">
          <p>
            <strong>Summary:</strong> {result.workoutSummary}
          </p>
        </div>
      )}

      {result.dailyWorkouts.map((day, i) => (
        <div key={i} className="day-section">
          <h3 className="day-header">{day.day}</h3>
          <div className="day-content">
            <div className="schedule-column">
              <div className="form-group">
                <strong>Type:</strong> <span>{day.workoutType}</span>
              </div>
              <div className="form-group">
                <strong>Location:</strong> <span>{day.location}</span>
              </div>
              {day.focusAreas && (
                <div className="form-group">
                  <strong>Focus:</strong> <span>{day.focusAreas}</span>
                </div>
              )}
              <div className="form-group">
                <strong>Details:</strong>
                <textarea
                  className="editable-field"
                  defaultValue={day.workoutDetails}
                  rows={3}
                />
              </div>
              {day.suggestedPostWorkoutMeal && (
                <div className="form-group">
                  <strong>Post-Workout Meal:</strong>
                  <textarea
                    className="editable-field"
                    defaultValue={day.suggestedPostWorkoutMeal}
                    rows={2}
                  />
                </div>
              )}
              {day.aiNotes && (
                <div className="form-group">
                  <strong>Notes:</strong> <span>{day.aiNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button className="new-plan-button" onClick={onBack}>
        Back to Form
      </button>
    </div>
  );
}
