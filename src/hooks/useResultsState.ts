"use client";

import { useState } from "react";
import {
  CalendarPlanResult,
  MealsPlanResult,
  WorkoutsPlanResult,
  DayMeals,
  WorkoutDayResult,
} from "@/types";

type MealField = keyof Pick<DayMeals, "breakfast" | "lunch" | "dinner" | "snacks">;

export function useResultsState(
  initialCalendar: CalendarPlanResult,
  initialMeals: MealsPlanResult,
  initialWorkouts: WorkoutsPlanResult
) {
  const [calendar, setCalendar] = useState(initialCalendar);
  const [meals, setMeals] = useState(initialMeals);
  const [workouts, setWorkouts] = useState(initialWorkouts);

  // --- Calendar updaters ---

  const updateStrategyNotes = (value: string) =>
    setCalendar((prev) => ({ ...prev, strategyNotes: value }));

  const updateTimeBlockDescription = (
    dayIndex: number,
    blockIndex: number,
    value: string
  ) =>
    setCalendar((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? {
              ...day,
              timeBlocks: day.timeBlocks.map((block, bi) =>
                bi === blockIndex ? { ...block, description: value } : block
              ),
            }
          : day
      ),
    }));

  const updateTimeBlockTimes = (
    dayIndex: number,
    blockIndex: number,
    startTime: string,
    endTime: string
  ) =>
    setCalendar((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? {
              ...day,
              timeBlocks: day.timeBlocks.map((block, bi) =>
                bi === blockIndex ? { ...block, startTime, endTime } : block
              ),
            }
          : day
      ),
    }));

  const updateCalendarListItem = (
    dayIndex: number,
    field: "bigRocks" | "choresAssigned",
    itemIndex: number,
    value: string
  ) =>
    setCalendar((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex
          ? {
              ...day,
              [field]: day[field].map((item, ii) =>
                ii === itemIndex ? value : item
              ),
            }
          : day
      ),
    }));

  const updateHobby = (dayIndex: number, value: string) =>
    setCalendar((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, di) =>
        di === dayIndex ? { ...day, hobbyAssigned: value } : day
      ),
    }));

  // --- Meals updaters ---

  const updateMealField = (dayIndex: number, field: MealField, value: string) =>
    setMeals((prev) => ({
      ...prev,
      dailyMeals: prev.dailyMeals.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));

  // --- Workouts updaters ---

  const updateWorkoutSummary = (value: string) =>
    setWorkouts((prev) => ({ ...prev, workoutSummary: value }));

  const updateWorkoutField = (
    dayIndex: number,
    field: keyof WorkoutDayResult,
    value: string
  ) =>
    setWorkouts((prev) => ({
      ...prev,
      dailyWorkouts: prev.dailyWorkouts.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));

  return {
    calendar,
    meals,
    workouts,
    updateStrategyNotes,
    updateTimeBlockDescription,
    updateTimeBlockTimes,
    updateCalendarListItem,
    updateHobby,
    updateMealField,
    updateWorkoutSummary,
    updateWorkoutField,
  };
}
