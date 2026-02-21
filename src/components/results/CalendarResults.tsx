import React, { useState, useEffect, useRef } from "react";
import { CalendarPlanResult } from "@/types";
import { useViewMode } from "@/hooks/useViewMode";
import ViewToggle from "./ViewToggle";
import CalendarGrid from "./CalendarGrid";

interface CalendarResultsProps {
  result: CalendarPlanResult;
  onBack: () => void;
  onDataChange?: (data: CalendarPlanResult) => void;
}

export default function CalendarResults({
  result,
  onBack,
  onDataChange,
}: CalendarResultsProps) {
  const [data, setData] = useState<CalendarPlanResult>(result);
  const { viewMode, setViewMode, selectedDayIndex, goToPrevDay, goToNextDay, goToDay } =
    useViewMode();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) { isInitial.current = false; return; }
    onDataChange?.(data);
  }, [data, onDataChange]);

  const updateStrategyNotes = (value: string) =>
    setData((prev) => ({ ...prev, strategyNotes: value }));

  const updateTimeBlock = (dayIndex: number, blockIndex: number, value: string) =>
    setData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? { ...day, timeBlocks: day.timeBlocks.map((b, bi) =>
              bi === blockIndex ? { ...b, description: value } : b
            ) }
          : day
      ),
    }));

  const updateTimeBlockTimes = (
    dayIndex: number, blockIndex: number, startTime: string, endTime: string
  ) =>
    setData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? { ...day, timeBlocks: day.timeBlocks.map((b, bi) =>
              bi === blockIndex ? { ...b, startTime, endTime } : b
            ) }
          : day
      ),
    }));

  const updateListItem = (
    dayIndex: number, field: "bigRocks" | "choresAssigned", itemIndex: number, value: string
  ) =>
    setData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? { ...day, [field]: day[field].map((item, ii) => ii === itemIndex ? value : item) }
          : day
      ),
    }));

  const updateHobby = (dayIndex: number, value: string) =>
    setData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex ? { ...day, hobbyAssigned: value } : day
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

      <CalendarGrid
        data={data}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateStrategyNotes={updateStrategyNotes}
        onUpdateTimeBlock={updateTimeBlock}
        onUpdateTimeBlockTimes={updateTimeBlockTimes}
        onUpdateListItem={updateListItem}
        onUpdateHobby={updateHobby}
      />

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Edit Inputs
        </button>
      </div>
    </>
  );
}
