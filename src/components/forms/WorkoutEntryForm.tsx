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

const INITIAL_ENTRY: Partial<WorkoutEntry> = {
  workoutType: "Lifting",
  location: "Gym",
  day: "",
  pinnedToDay: false,
  startTime: "",
  endTime: "",
  details: "",
  notes: "",
};

function buildWorkout(draft: Partial<WorkoutEntry>): WorkoutEntry {
  return {
    id: generateId("workout"),
    workoutType: draft.workoutType || "Lifting",
    location: draft.location || "Gym",
    day: draft.day || "",
    pinnedToDay: draft.pinnedToDay || false,
    startTime: draft.pinnedToDay ? draft.startTime || "" : "",
    endTime: draft.pinnedToDay ? draft.endTime || "" : "",
    details: draft.details || "",
    notes: draft.notes || "",
  };
}

export default function WorkoutEntryForm({
  onSave,
  onCancel,
}: WorkoutEntryFormProps) {
  const [entry, setEntry] = useState<Partial<WorkoutEntry>>(INITIAL_ENTRY);
  const [pending, setPending] = useState<WorkoutEntry[]>([]);

  const handleAddAnother = () => {
    setPending((prev) => [...prev, buildWorkout(entry)]);
    setEntry({ ...INITIAL_ENTRY });
  };

  const handleSave = () => {
    const all = [...pending, buildWorkout(entry)];
    if (all.length === 0) return;
    all.forEach((item) => onSave(item));
    onCancel();
  };

  const removePending = (index: number) => {
    setPending((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="add-form">
      {pending.length > 0 && (
        <ul className="add-form__pending">
          {pending.map((item, i) => (
            <li key={i}>
              <span>
                {item.workoutType} · {item.location}
                {item.day ? ` · ${item.day}` : ""}
              </span>
              <button
                type="button"
                onClick={() => removePending(i)}
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

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
              placeholder="4:00 PM"
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
              placeholder="5:30 PM"
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
        <button
          type="button"
          className="add-another-button"
          onClick={handleAddAnother}
        >
          + Add Another
        </button>
        <button type="button" className="save-button" onClick={handleSave}>
          Save{pending.length > 0 ? ` (${pending.length + 1})` : ""}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
