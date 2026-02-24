import React, { useState } from "react";
import { WorkoutEntry } from "@/types";
import { DAYS_SUNDAY_START } from "@/lib/constants";
import FormSection from "../shared/FormSection";
import ListItem from "../shared/ListItem";
import WorkoutEntryForm from "../forms/WorkoutEntryForm";

interface WorkoutScheduleSectionProps {
  workouts: WorkoutEntry[];
  onUpdate: (workouts: WorkoutEntry[]) => void;
}

const DAY_ORDER = DAYS_SUNDAY_START.reduce(
  (acc, day, i) => {
    acc[day] = i;
    return acc;
  },
  {} as Record<string, number>
);

function sortWorkouts(workouts: WorkoutEntry[]): WorkoutEntry[] {
  return [...workouts].sort((a, b) => {
    const aHasDay = a.day !== "";
    const bHasDay = b.day !== "";
    if (aHasDay && !bHasDay) return -1;
    if (!aHasDay && bHasDay) return 1;
    if (aHasDay && bHasDay) {
      return (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99);
    }
    return 0;
  });
}

export default function WorkoutScheduleSection({
  workouts,
  onUpdate,
}: WorkoutScheduleSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (entry: WorkoutEntry) => {
    onUpdate([...workouts, entry]);
  };

  const handleRemove = (id: string) => {
    onUpdate(workouts.filter((w) => w.id !== id));
  };

  const sorted = sortWorkouts(workouts);

  return (
    <FormSection title="Workout Schedule">
      {sorted.map((workout) => (
        <ListItem
          key={workout.id}
          onRemove={() => handleRemove(workout.id)}
          className="workout-entry"
        >
          <div className="workout-entry__info">
            <strong>{workout.workoutType}</strong>
            <span className="workout-entry__meta">
              {workout.location}
              {" · "}
              {workout.day || "Any Day"}
              {workout.day && workout.pinnedToDay && " (pinned)"}
              {workout.startTime && workout.endTime && (
                <>{" · "}{workout.startTime} – {workout.endTime}</>
              )}
            </span>
          </div>
          {workout.details && (
            <p className="workout-entry__details">{workout.details}</p>
          )}
          {workout.notes && (
            <p className="workout-entry__notes">{workout.notes}</p>
          )}
        </ListItem>
      ))}

      {!showForm && (
        <button
          type="button"
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Workout
        </button>
      )}

      {showForm && (
        <WorkoutEntryForm
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
    </FormSection>
  );
}
