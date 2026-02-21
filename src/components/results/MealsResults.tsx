import React, { useState, useEffect, useRef } from "react";
import { MealsPlanResult, DayMeals } from "@/types";
import { useViewMode } from "@/hooks/useViewMode";
import ViewToggle from "./ViewToggle";
import MealsGrid from "./MealsGrid";
import ShoppingListSection from "./ShoppingListSection";

interface MealsResultsProps {
  result: MealsPlanResult;
  onBack: () => void;
  onDataChange?: (data: MealsPlanResult) => void;
}

type MealField = keyof Pick<DayMeals, "breakfast" | "lunch" | "dinner" | "snacks">;

export default function MealsResults({ result, onBack, onDataChange }: MealsResultsProps) {
  const [data, setData] = useState<MealsPlanResult>(result);
  const { viewMode, setViewMode, selectedDayIndex, goToPrevDay, goToNextDay, goToDay } =
    useViewMode();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) { isInitial.current = false; return; }
    onDataChange?.(data);
  }, [data, onDataChange]);

  const updateMeal = (dayIndex: number, field: MealField, value: string) => {
    setData((prev) => ({
      ...prev,
      dailyMeals: prev.dailyMeals.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

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

      <MealsGrid
        data={data}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateMeal={updateMeal}
      />

      {data.shoppingList && (
        <ShoppingListSection data={data.shoppingList} />
      )}

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Edit Inputs
        </button>
      </div>
    </>
  );
}
