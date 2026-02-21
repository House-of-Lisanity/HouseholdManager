import React, { useState } from "react";
import { WorkoutsPlanResult, WorkoutDayResult } from "@/types";

interface WorkoutsResultsProps {
  result: WorkoutsPlanResult;
  onBack: () => void;
}

export default function WorkoutsResults({
  result,
  onBack,
}: WorkoutsResultsProps) {
  const [data, setData] = useState<WorkoutsPlanResult>(result);

  const updateWorkout = (
    dayIndex: number,
    field: keyof WorkoutDayResult,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      dailyWorkouts: prev.dailyWorkouts.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Workout Plan</h2>
        <p>Week of {data.weekOf}</p>
      </div>

      {data.workoutSummary && (
        <div className="plan-summary">
          <strong>Summary:</strong>
          <textarea
            className="editable-field"
            value={data.workoutSummary}
            onChange={(e) =>
              setData((prev) => ({ ...prev, workoutSummary: e.target.value }))
            }
            rows={2}
          />
        </div>
      )}

      {data.dailyWorkouts.map((day, dayIndex) => (
        <div key={dayIndex} className="day-section">
          <h3 className="day-header">{day.day}</h3>
          <div className="day-content">
            <div className="schedule-column">
              <div className="workout-result-field">
                <strong>Type:</strong>
                <input
                  type="text"
                  className="editable-field"
                  value={day.workoutType}
                  onChange={(e) =>
                    updateWorkout(dayIndex, "workoutType", e.target.value)
                  }
                />
              </div>
              <div className="workout-result-field">
                <strong>Location:</strong>
                <input
                  type="text"
                  className="editable-field"
                  value={day.location}
                  onChange={(e) =>
                    updateWorkout(dayIndex, "location", e.target.value)
                  }
                />
              </div>
              <div className="workout-result-field">
                <strong>Focus:</strong>
                <input
                  type="text"
                  className="editable-field"
                  value={day.focusAreas || ""}
                  onChange={(e) =>
                    updateWorkout(dayIndex, "focusAreas", e.target.value)
                  }
                />
              </div>
              <div className="workout-result-field">
                <strong>Details:</strong>
                <textarea
                  className="editable-field"
                  value={day.workoutDetails}
                  onChange={(e) =>
                    updateWorkout(dayIndex, "workoutDetails", e.target.value)
                  }
                  rows={4}
                />
              </div>
              {day.aiNotes && (
                <div className="workout-result-field">
                  <strong>Notes:</strong>
                  <input
                    type="text"
                    className="editable-field"
                    value={day.aiNotes}
                    onChange={(e) =>
                      updateWorkout(dayIndex, "aiNotes", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Back to Form
        </button>
        <button
          className="print-button"
          onClick={() => window.print()}
          aria-label="Print workout plan"
        >
          Print
        </button>
      </div>
    </div>
  );
}
