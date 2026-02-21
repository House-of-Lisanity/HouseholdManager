import React, { useState, useEffect, useRef } from "react";
import { WorkoutsPlanResult, WorkoutDayResult } from "@/types";
import { useViewMode } from "@/hooks/useViewMode";
import ViewToggle from "./ViewToggle";
import WorkoutsGrid from "./WorkoutsGrid";

interface WorkoutsResultsProps {
  result: WorkoutsPlanResult;
  onBack: () => void;
  onDataChange?: (data: WorkoutsPlanResult) => void;
}

export default function WorkoutsResults({
  result,
  onBack,
  onDataChange,
}: WorkoutsResultsProps) {
  const [data, setData] = useState<WorkoutsPlanResult>(result);
  const { viewMode, setViewMode, selectedDayIndex, goToPrevDay, goToNextDay, goToDay } =
    useViewMode();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) { isInitial.current = false; return; }
    onDataChange?.(data);
  }, [data, onDataChange]);

  const updateSummary = (value: string) =>
    setData((prev) => ({ ...prev, workoutSummary: value }));

  const updateField = (dayIndex: number, field: keyof WorkoutDayResult, value: string) =>
    setData((prev) => ({
      ...prev,
      dailyWorkouts: prev.dailyWorkouts.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));

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

      <WorkoutsGrid
        data={data}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateSummary={updateSummary}
        onUpdateField={updateField}
      />

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Edit Inputs
        </button>
      </div>
    </>
  );
}
