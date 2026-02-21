import React, { useState } from "react";
import { WorkoutEntry } from "@/types";
import {
  generateId,
  DAYS_SUNDAY_START,
  WORKOUT_TYPES,
  LOCATIONS,
} from "@/lib/constants";

interface WorkoutEntryFormProps {
  onSave: (entry: WorkoutEntry) => void;
  onCancel: () => void;
}

export default function WorkoutEntryForm({
  onSave,
  onCancel,
}: WorkoutEntryFormProps) {
  const [entry, setEntry] = useState<Partial<WorkoutEntry>>({
    workoutType: "Lifting",
    location: "Gym",
    day: "",
    pinnedToDay: false,
    startTime: "",
    endTime: "",
    details: "",
    notes: "",
  });

  const handleSave = () => {
    onSave({
      id: generateId("workout"),
      workoutType: entry.workoutType || "Lifting",
      location: entry.location || "Gym",
      day: entry.day || "",
      pinnedToDay: entry.pinnedToDay || false,
      startTime: entry.pinnedToDay ? entry.startTime || "" : "",
      endTime: entry.pinnedToDay ? entry.endTime || "" : "",
      details: entry.details || "",
      notes: entry.notes || "",
    });
  };

  return (
    <div className="add-form">
      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="workout-type">Workout Type</label>
          <select
            id="workout-type"
            value={entry.workoutType}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, workoutType: e.target.value }))
            }
          >
            {WORKOUT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workout-location">Location</label>
          <select
            id="workout-location"
            value={entry.location}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, location: e.target.value }))
            }
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workout-day">Day</label>
          <select
            id="workout-day"
            value={entry.day}
            onChange={(e) =>
              setEntry((prev) => ({
                ...prev,
                day: e.target.value,
                pinnedToDay: e.target.value ? prev.pinnedToDay : false,
              }))
            }
          >
            <option value="">Any Day</option>
            {DAYS_SUNDAY_START.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {entry.day && (
          <div className="form-group">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={entry.pinnedToDay || false}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    pinnedToDay: e.target.checked,
                  }))
                }
              />
              <span>Must be this day</span>
            </label>
          </div>
        )}
      </div>

      {entry.pinnedToDay && (
        <div className="form-grid form-grid--2col">
          <div className="form-group">
            <label htmlFor="workout-start-time">Start Time</label>
            <input
              id="workout-start-time"
              type="text"
              placeholder="e.g., 4:00 PM"
              value={entry.startTime || ""}
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, startTime: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="workout-end-time">End Time</label>
            <input
              id="workout-end-time"
              type="text"
              placeholder="e.g., 5:30 PM"
              value={entry.endTime || ""}
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, endTime: e.target.value }))
              }
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="workout-details">
          Details (paste from Wodify, StrongLifts, etc.)
        </label>
        <textarea
          id="workout-details"
          placeholder="Paste workout details here..."
          value={entry.details || ""}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, details: e.target.value }))
          }
          rows={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="workout-notes">Notes</label>
        <input
          id="workout-notes"
          type="text"
          placeholder="Any additional notes..."
          value={entry.notes || ""}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
