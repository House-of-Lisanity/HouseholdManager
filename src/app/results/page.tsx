"use client";

import React, { useState, useEffect, useRef } from "react";
import { CalendarPlanResult, MealsPlanResult, WorkoutsPlanResult } from "@/types";
import { useSavedResult } from "@/hooks/useSavedResult";
import { useViewMode } from "@/hooks/useViewMode";
import { useResultsState } from "@/hooks/useResultsState";
import { getWeekOf } from "@/lib/workout-log-helpers";
import { generateAllPlans } from "@/lib/api-client";
import WeekNavigation from "@/components/shared/WeekNavigation";
import ViewToggle from "@/components/results/ViewToggle";
import CalendarGrid from "@/components/results/CalendarGrid";
import MealsGrid from "@/components/results/MealsGrid";
import WorkoutsGrid from "@/components/results/WorkoutsGrid";
import ShoppingListSection from "@/components/results/ShoppingListSection";
import SectionPrintButton from "@/components/results/SectionPrintButton";

interface ResultsViewProps {
  calendar: CalendarPlanResult;
  meals: MealsPlanResult;
  workouts: WorkoutsPlanResult;
  onCalendarSave: (data: CalendarPlanResult) => void;
  onMealsSave: (data: MealsPlanResult) => void;
  onWorkoutsSave: (data: WorkoutsPlanResult) => void;
}

function ResultsView({
  calendar: initialCalendar,
  meals: initialMeals,
  workouts: initialWorkouts,
  onCalendarSave,
  onMealsSave,
  onWorkoutsSave,
}: ResultsViewProps) {
  const { viewMode, setViewMode, selectedDayIndex, goToPrevDay, goToNextDay, goToDay } =
    useViewMode();
  const state = useResultsState(initialCalendar, initialMeals, initialWorkouts);

  // Stable refs for save callbacks
  const calSaveRef = useRef(onCalendarSave);
  calSaveRef.current = onCalendarSave;
  const mealsSaveRef = useRef(onMealsSave);
  mealsSaveRef.current = onMealsSave;
  const workoutsSaveRef = useRef(onWorkoutsSave);
  workoutsSaveRef.current = onWorkoutsSave;

  // Auto-save on edit (skip initial render)
  const calInit = useRef(true);
  const mealsInit = useRef(true);
  const workoutsInit = useRef(true);

  useEffect(() => {
    if (calInit.current) { calInit.current = false; return; }
    calSaveRef.current(state.calendar);
  }, [state.calendar]);

  useEffect(() => {
    if (mealsInit.current) { mealsInit.current = false; return; }
    mealsSaveRef.current(state.meals);
  }, [state.meals]);

  useEffect(() => {
    if (workoutsInit.current) { workoutsInit.current = false; return; }
    workoutsSaveRef.current(state.workouts);
  }, [state.workouts]);

  return (
    <>
      <ViewToggle
        viewMode={viewMode}
        onToggle={setViewMode}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={goToDay}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
      />

      <CalendarGrid
        data={state.calendar}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateStrategyNotes={state.updateStrategyNotes}
        onUpdateTimeBlock={state.updateTimeBlockDescription}
        onUpdateTimeBlockTimes={state.updateTimeBlockTimes}
        onUpdateListItem={state.updateCalendarListItem}
        onUpdateHobby={state.updateHobby}
      />

      <MealsGrid
        data={state.meals}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateMeal={state.updateMealField}
      />

      <WorkoutsGrid
        data={state.workouts}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateSummary={state.updateWorkoutSummary}
        onUpdateField={state.updateWorkoutField}
      />

      <ShoppingListSection data={state.meals.shoppingList} />
    </>
  );
}

export default function ResultsPage() {
  const [weekOf, setWeekOf] = useState(() => getWeekOf());
  const calendar = useSavedResult<CalendarPlanResult>("calendar", weekOf);
  const meals = useSavedResult<MealsPlanResult>("meals", weekOf);
  const workouts = useSavedResult<WorkoutsPlanResult>("workouts", weekOf);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genCount, setGenCount] = useState(0);

  const loading = calendar.loading || meals.loading || workouts.loading;
  const hasAll = !!(calendar.result && meals.result && workouts.result);

  const handleGenerateAll = async (regenerateAll = false) => {
    setGenerating(true);
    setError(null);
    try {
      // Skip sections that already have saved results (unless regenerating)
      const skip: ("calendar" | "meals" | "workouts")[] = [];
      if (!regenerateAll) {
        if (calendar.result) skip.push("calendar");
        if (meals.result) skip.push("meals");
        if (workouts.result) skip.push("workouts");
      }

      const result = await generateAllPlans(weekOf, skip);
      if (result.calendar) calendar.setResult(result.calendar);
      if (result.meals) meals.setResult(result.meals);
      if (result.workouts) workouts.setResult(result.workouts);
      setGenCount((c) => c + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <header className="results-page__header">
        <div>
          <h1>Weekly Plan</h1>
        </div>
        {hasAll && <SectionPrintButton section="all" label="Print All" />}
      </header>

      <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {hasAll ? (
        <>
          <ResultsView
            key={`${weekOf}-${genCount}`}
            calendar={calendar.result!}
            meals={meals.result!}
            workouts={workouts.result!}
            onCalendarSave={calendar.saveResult}
            onMealsSave={meals.saveResult}
            onWorkoutsSave={workouts.saveResult}
          />

          <div className="result-actions">
            <button
              className="submit-button"
              onClick={() => handleGenerateAll(true)}
              disabled={generating}
            >
              {generating ? "Regenerating..." : "Regenerate All Plans"}
            </button>
          </div>
        </>
      ) : (
        <div className="generate-prompt">
          <p>Generate all three plans at once using your saved inputs.</p>
          <button
            className="submit-button"
            onClick={() => handleGenerateAll()}
            disabled={generating}
          >
            {generating ? "Generating All Plans..." : "Generate All Plans"}
          </button>
        </div>
      )}
    </div>
  );
}
