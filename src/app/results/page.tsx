"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MOCK_CALENDAR_RESULT } from "@/data/mock-calendar";
import { MOCK_MEALS_RESULT } from "@/data/mock-meals";
import { MOCK_WORKOUTS_RESULT } from "@/data/mock-workouts";
import { useViewMode } from "@/hooks/useViewMode";
import { useResultsState } from "@/hooks/useResultsState";
import ViewToggle from "@/components/results/ViewToggle";
import CalendarGrid from "@/components/results/CalendarGrid";
import MealsGrid from "@/components/results/MealsGrid";
import WorkoutsGrid from "@/components/results/WorkoutsGrid";
import SectionPrintButton from "@/components/results/SectionPrintButton";

export default function ResultsPage() {
  const router = useRouter();
  const { viewMode, setViewMode, selectedDayIndex, goToPrevDay, goToNextDay, goToDay } =
    useViewMode();
  const state = useResultsState(
    MOCK_CALENDAR_RESULT,
    MOCK_MEALS_RESULT,
    MOCK_WORKOUTS_RESULT
  );

  return (
    <div className="results-page">
      <header className="results-page__header">
        <div>
          <h1>Weekly Plan</h1>
          <p>Week of {state.calendar.weekOf}</p>
        </div>
        <SectionPrintButton section="all" label="Print All" />
      </header>

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
        onUpdateListItem={state.updateCalendarListItem}
        onUpdateHobby={state.updateHobby}
      />

      <MealsGrid
        data={state.meals}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateProteinTarget={state.updateProteinTarget}
        onUpdateMeal={state.updateMealField}
        onUpdateShoppingItem={state.updateShoppingItem}
      />

      <WorkoutsGrid
        data={state.workouts}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateSummary={state.updateWorkoutSummary}
        onUpdateField={state.updateWorkoutField}
      />

      <div className="result-actions">
        <button className="new-plan-button" onClick={() => router.back()}>
          Back
        </button>
      </div>
    </div>
  );
}
