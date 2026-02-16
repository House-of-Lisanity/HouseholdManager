import React, { useState } from "react";
import { WorkoutLog, ExerciseLog } from "@/types";
import { WORKOUT_TYPES, LOCATIONS } from "@/lib/constants";
import { createEmptyExercise } from "@/lib/workout-log-helpers";
import ExerciseLogEntry from "./ExerciseLogEntry";

interface WorkoutLogFormProps {
  initialData: Omit<WorkoutLog, "_id"> & { _id?: string };
  onSave: (log: Omit<WorkoutLog, "_id"> & { _id?: string }) => void;
  onCancel: () => void;
  plannedDetails?: string;
}

export default function WorkoutLogForm({
  initialData,
  onSave,
  onCancel,
  plannedDetails,
}: WorkoutLogFormProps) {
  const [formData, setFormData] = useState(initialData);

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateExercise = (index: number, updated: ExerciseLog) => {
    const exercises = formData.exercises.map((ex, i) =>
      i === index ? updated : ex
    );
    updateField("exercises", exercises);
  };

  const removeExercise = (index: number) => {
    updateField(
      "exercises",
      formData.exercises.filter((_, i) => i !== index)
    );
  };

  const addExercise = () => {
    updateField("exercises", [...formData.exercises, createEmptyExercise()]);
  };

  const isEditing = Boolean(initialData._id);

  const handleSave = () => {
    onSave({ ...formData, completedAt: new Date().toISOString() });
  };

  return (
    <div className="workout-log-form">
      {plannedDetails && (
        <div className="planned-comparison">
          <strong>Planned:</strong>
          <p>{plannedDetails}</p>
        </div>
      )}

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="log-date">Date</label>
          <input
            id="log-date"
            type="date"
            value={formData.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="log-workout-type">Workout Type</label>
          <select
            id="log-workout-type"
            value={formData.workoutType}
            onChange={(e) => updateField("workoutType", e.target.value)}
          >
            <option value="">Select type...</option>
            {WORKOUT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="log-location">Location</label>
          <select
            id="log-location"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
          >
            <option value="">Select location...</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="log-duration">Duration (min)</label>
          <input
            id="log-duration"
            type="number"
            min="0"
            value={formData.duration || ""}
            onChange={(e) =>
              updateField("duration", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="log-rpe">RPE (1-10)</label>
          <input
            id="log-rpe"
            type="number"
            min="1"
            max="10"
            value={formData.rpe || ""}
            onChange={(e) =>
              updateField("rpe", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      <div className="workout-log-form__exercises">
        <h4>Exercises</h4>
        {formData.exercises.map((exercise, i) => (
          <ExerciseLogEntry
            key={i}
            exercise={exercise}
            index={i}
            onChange={updateExercise}
            onRemove={removeExercise}
          />
        ))}
        <button className="add-inline-button" onClick={addExercise}>
          + Add Exercise
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="log-raw-details">WOD / Cardio Details</label>
        <textarea
          id="log-raw-details"
          rows={4}
          placeholder="Paste WOD or describe cardio..."
          value={formData.rawDetails}
          onChange={(e) => updateField("rawDetails", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="log-notes">Notes</label>
        <textarea
          id="log-notes"
          rows={3}
          placeholder="How did it feel?"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button className="save-button" onClick={handleSave}>
          {isEditing ? "Update Log" : "Save Log"}
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
