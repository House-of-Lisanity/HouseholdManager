"use client";

import React, { useState, useEffect, useRef } from "react";
import { WorkoutEntry, WorkoutLog } from "@/types";
import { useWorkoutLogs } from "@/hooks/useWorkoutLogs";
import {
  createLogFromPlan,
  createModifiedLogTemplate,
  createUnplannedLogTemplate,
} from "@/lib/workout-log-helpers";
import PlannedWorkoutCard from "@/components/workout-log/PlannedWorkoutCard";
import WorkoutLogForm from "@/components/workout-log/WorkoutLogForm";
import LoggedWorkoutCard from "@/components/workout-log/LoggedWorkoutCard";
import WeekNavigation from "@/components/shared/WeekNavigation";

type ActiveForm =
  | { type: "modified"; entry: WorkoutEntry }
  | { type: "unplanned" }
  | { type: "edit"; log: WorkoutLog }
  | null;

export default function WorkoutLogPage() {
  const { logs, weekOf, setWeekOf, loading, error, createLog, updateLog, deleteLog } =
    useWorkoutLogs();
  const [plannedWorkouts, setPlannedWorkouts] = useState<WorkoutEntry[]>([]);
  const [plannedLoading, setPlannedLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadPlanned() {
      try {
        const res = await fetch(`/api/workouts?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          setPlannedWorkouts(data?.workouts || []);
        }
      } catch (err) {
        console.error("Failed to load planned workouts:", err);
      } finally {
        setPlannedLoading(false);
      }
    }
    loadPlanned();
  }, [weekOf]);

  const showStatus = (message: string) => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setStatusMessage(message);
    statusTimer.current = setTimeout(() => setStatusMessage(null), 3000);
  };

  const loggedPlanIds = new Set(
    logs.filter((l) => l.plannedWorkoutId).map((l) => l.plannedWorkoutId)
  );

  const handleCompleteAsPlanned = async (entry: WorkoutEntry, date: string) => {
    await createLog(createLogFromPlan(entry, weekOf, date));
    showStatus("Workout logged!");
  };

  const handleLogWithChanges = (entry: WorkoutEntry) => {
    setActiveForm({ type: "modified", entry });
  };

  const handleSaveForm = async (
    log: Omit<WorkoutLog, "_id"> & { _id?: string }
  ) => {
    if (log._id) {
      await updateLog(log as WorkoutLog);
      showStatus("Workout log updated!");
    } else {
      await createLog(log);
      showStatus("Workout logged!");
    }
    setActiveForm(null);
  };

  const handleDelete = async (id: string) => {
    await deleteLog(id);
    showStatus("Workout log deleted.");
  };

  const handleEdit = (log: WorkoutLog) => {
    setActiveForm({ type: "edit", log });
  };

  const handleWeekChange = (newWeekOf: string) => {
    setActiveForm(null);
    setWeekOf(newWeekOf);
    setPlannedLoading(true);
  };

  if (loading || plannedLoading) {
    return (
      <div className="container">
        <p>Loading workout log...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="workout-log-header">
        <h2>Workout Log</h2>
        <WeekNavigation weekOf={weekOf} onChange={handleWeekChange} />
      </div>

      {error && <p className="error-message">{error}</p>}
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {plannedWorkouts.length > 0 && (
        <section className="workout-log-section">
          <h3>Planned Workouts</h3>
          <div className="workout-log-section__list">
            {plannedWorkouts.map((entry) => (
              <PlannedWorkoutCard
                key={entry.id}
                entry={entry}
                isLogged={loggedPlanIds.has(entry.id)}
                onCompleteAsPlanned={(date) => handleCompleteAsPlanned(entry, date)}
                onLogWithChanges={() => handleLogWithChanges(entry)}
              />
            ))}
          </div>
        </section>
      )}

      {!activeForm && (
        <button
          className="log-button log-button--secondary"
          onClick={() => setActiveForm({ type: "unplanned" })}
        >
          + Log Extra Workout
        </button>
      )}

      {activeForm && (
        <section className="workout-log-section">
          <h3>
            {activeForm.type === "edit"
              ? "Edit Workout Log"
              : activeForm.type === "modified"
                ? "Log with Changes"
                : "Log Extra Workout"}
          </h3>
          <WorkoutLogForm
            initialData={
              activeForm.type === "edit"
                ? activeForm.log
                : activeForm.type === "modified"
                  ? createModifiedLogTemplate(activeForm.entry, weekOf)
                  : createUnplannedLogTemplate(weekOf)
            }
            onSave={handleSaveForm}
            onCancel={() => setActiveForm(null)}
            plannedDetails={
              activeForm.type === "modified"
                ? activeForm.entry.details
                : undefined
            }
          />
        </section>
      )}

      <section className="workout-log-section">
        <h3>Completed This Week</h3>
        {logs.length === 0 ? (
          <p className="empty-state">No workouts logged yet this week.</p>
        ) : (
          <div className="workout-log-section__list">
            {logs.map((log) => (
              <LoggedWorkoutCard
                key={log._id}
                log={log}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
