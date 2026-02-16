import React from "react";
import { ExerciseLog, SetLog } from "@/types";
import { createEmptySet } from "@/lib/workout-log-helpers";

const SET_TYPES = ["working", "warmup", "drop", "failure"] as const;

interface ExerciseLogEntryProps {
  exercise: ExerciseLog;
  index: number;
  onChange: (index: number, updated: ExerciseLog) => void;
  onRemove: (index: number) => void;
}

export default function ExerciseLogEntry({
  exercise,
  index,
  onChange,
  onRemove,
}: ExerciseLogEntryProps) {
  const updateField = (field: keyof ExerciseLog, value: string) => {
    onChange(index, { ...exercise, [field]: value });
  };

  const updateSet = (setIdx: number, field: keyof SetLog, value: string | number) => {
    const updatedSets = exercise.sets.map((s, i) =>
      i === setIdx ? { ...s, [field]: value } : s
    );
    onChange(index, { ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    const nextNumber = exercise.sets.length + 1;
    onChange(index, { ...exercise, sets: [...exercise.sets, createEmptySet(nextNumber)] });
  };

  const removeSet = (setIdx: number) => {
    const updatedSets = exercise.sets
      .filter((_, i) => i !== setIdx)
      .map((s, i) => ({ ...s, setNumber: i + 1 }));
    onChange(index, { ...exercise, sets: updatedSets });
  };

  return (
    <div className="exercise-log-entry">
      <div className="exercise-log-entry__header">
        <input
          type="text"
          placeholder="Exercise name"
          value={exercise.exerciseName}
          onChange={(e) => updateField("exerciseName", e.target.value)}
          className="exercise-log-entry__name"
          aria-label={`Exercise ${index + 1} name`}
        />
        <button
          className="remove-button"
          onClick={() => onRemove(index)}
          aria-label={`Remove exercise ${index + 1}`}
        >
          Remove
        </button>
      </div>

      <div className="set-grid">
        <div className="set-grid__header">
          <span>Set</span>
          <span>Weight (lb)</span>
          <span>Reps</span>
          <span>Type</span>
          <span></span>
        </div>
        {exercise.sets.map((set, setIdx) => (
          <div className="set-grid__row" key={setIdx}>
            <span className="set-grid__number">{set.setNumber}</span>
            <input
              type="number"
              min="0"
              value={set.weight || ""}
              onChange={(e) => updateSet(setIdx, "weight", Number(e.target.value))}
              aria-label={`Set ${set.setNumber} weight`}
            />
            <input
              type="number"
              min="0"
              value={set.reps || ""}
              onChange={(e) => updateSet(setIdx, "reps", Number(e.target.value))}
              aria-label={`Set ${set.setNumber} reps`}
            />
            <select
              value={set.type}
              onChange={(e) => updateSet(setIdx, "type", e.target.value)}
              aria-label={`Set ${set.setNumber} type`}
            >
              {SET_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              className="remove-button remove-button--small"
              onClick={() => removeSet(setIdx)}
              aria-label={`Remove set ${set.setNumber}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button className="add-inline-button" onClick={addSet}>
        + Add Set
      </button>

      <input
        type="text"
        placeholder="Exercise notes (optional)"
        value={exercise.notes}
        onChange={(e) => updateField("notes", e.target.value)}
        className="exercise-log-entry__notes"
        aria-label={`Exercise ${index + 1} notes`}
      />
    </div>
  );
}
