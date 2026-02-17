"use client";

import React, { useState, useEffect, useRef } from "react";
import { MealEntry, MealLog } from "@/types";
import { useMealLogs } from "@/hooks/useMealLogs";
import {
  createMealLogFromPlan,
  createModifiedMealLogTemplate,
  createUnplannedMealLogTemplate,
} from "@/lib/meal-log-helpers";
import PlannedMealCard from "@/components/meal-log/PlannedMealCard";
import MealLogForm from "@/components/meal-log/MealLogForm";
import LoggedMealCard from "@/components/meal-log/LoggedMealCard";
import DailyNutritionSummary from "@/components/meal-log/DailyNutritionSummary";
import WeekNavigation from "@/components/shared/WeekNavigation";

type ActiveForm =
  | { type: "modified"; entry: MealEntry }
  | { type: "unplanned" }
  | { type: "edit"; log: MealLog }
  | null;

export default function MealLogPage() {
  const {
    logs,
    weekOf,
    setWeekOf,
    loading,
    error,
    createLog,
    updateLog,
    deleteLog,
  } = useMealLogs();
  const [plannedMeals, setPlannedMeals] = useState<MealEntry[]>([]);
  const [plannedLoading, setPlannedLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadPlanned() {
      try {
        const res = await fetch(`/api/meals?weekOf=${weekOf}`);
        if (res.ok) {
          const data = await res.json();
          setPlannedMeals(data?.meals || []);
        }
      } catch (err) {
        console.error("Failed to load planned meals:", err);
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
    logs.filter((l) => l.plannedMealId).map((l) => l.plannedMealId)
  );

  const handleCompleteAsPlanned = async (
    entry: MealEntry,
    date: string
  ) => {
    await createLog(createMealLogFromPlan(entry, weekOf, date));
    showStatus("Meal logged!");
  };

  const handleLogWithChanges = (entry: MealEntry) => {
    setActiveForm({ type: "modified", entry });
  };

  const handleSaveForm = async (
    log: Omit<MealLog, "_id"> & { _id?: string }
  ) => {
    if (log._id) {
      await updateLog(log as MealLog);
      showStatus("Meal log updated!");
    } else {
      await createLog(log);
      showStatus("Meal logged!");
    }
    setActiveForm(null);
  };

  const handleDelete = async (id: string) => {
    await deleteLog(id);
    showStatus("Meal log deleted.");
  };

  const handleEdit = (log: MealLog) => {
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
        <p>Loading meal log...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="meal-log-header">
        <h2>Meal Log</h2>
        <WeekNavigation weekOf={weekOf} onChange={handleWeekChange} />
      </div>

      {error && <p className="error-message">{error}</p>}
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <DailyNutritionSummary logs={logs} />

      {plannedMeals.length > 0 && (
        <section className="meal-log-section">
          <h3>Planned Meals</h3>
          <div className="meal-log-section__list">
            {plannedMeals.map((entry) => (
              <PlannedMealCard
                key={entry.id}
                entry={entry}
                isLogged={loggedPlanIds.has(entry.id)}
                onCompleteAsPlanned={(date) =>
                  handleCompleteAsPlanned(entry, date)
                }
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
          + Log Extra Meal
        </button>
      )}

      {activeForm && (
        <section className="meal-log-section">
          <h3>
            {activeForm.type === "edit"
              ? "Edit Meal Log"
              : activeForm.type === "modified"
                ? "Log with Changes"
                : "Log Extra Meal"}
          </h3>
          <MealLogForm
            initialData={
              activeForm.type === "edit"
                ? activeForm.log
                : activeForm.type === "modified"
                  ? createModifiedMealLogTemplate(activeForm.entry, weekOf)
                  : createUnplannedMealLogTemplate(weekOf)
            }
            onSave={handleSaveForm}
            onCancel={() => setActiveForm(null)}
            plannedDescription={
              activeForm.type === "modified"
                ? activeForm.entry.ingredients || activeForm.entry.mealName
                : undefined
            }
          />
        </section>
      )}

      <section className="meal-log-section">
        <h3>Logged This Week</h3>
        {logs.length === 0 ? (
          <p className="empty-state">No meals logged yet this week.</p>
        ) : (
          <div className="meal-log-section__list">
            {logs.map((log) => (
              <LoggedMealCard
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
