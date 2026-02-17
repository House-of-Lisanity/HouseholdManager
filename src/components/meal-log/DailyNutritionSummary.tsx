import React from "react";
import { MealLog } from "@/types";
import { useProfile } from "@/contexts/ProfileContext";
import { getTodayISO } from "@/lib/workout-log-helpers";

interface DailyNutritionSummaryProps {
  logs: MealLog[];
}

export default function DailyNutritionSummary({
  logs,
}: DailyNutritionSummaryProps) {
  const { profile } = useProfile();
  const today = getTodayISO();

  const todayLogs = logs.filter((log) => log.date === today);

  if (todayLogs.length === 0) return null;

  const totals = todayLogs.reduce(
    (acc, log) => {
      if (log.nutrition) {
        acc.calories += Number(log.nutrition.calories) || 0;
        acc.protein += Number(log.nutrition.protein) || 0;
        acc.carbs += Number(log.nutrition.carbs) || 0;
        acc.fat += Number(log.nutrition.fat) || 0;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieTarget = Number(profile.targetCalories) || 0;
  const proteinTarget = Number(profile.targetProtein) || 0;

  return (
    <div className="daily-nutrition-summary">
      <h4>Today&apos;s Nutrition</h4>
      <div className="daily-nutrition-summary__rows">
        <div className="daily-nutrition-summary__row">
          <span className="daily-nutrition-summary__label">Calories</span>
          <span className="daily-nutrition-summary__value">
            {totals.calories.toLocaleString()}
            {calorieTarget > 0 && (
              <span className="daily-nutrition-summary__target">
                {" "}
                / {calorieTarget.toLocaleString()}
              </span>
            )}
          </span>
        </div>
        <div className="daily-nutrition-summary__row">
          <span className="daily-nutrition-summary__label">Protein</span>
          <span className="daily-nutrition-summary__value">
            {totals.protein}g
            {proteinTarget > 0 && (
              <span className="daily-nutrition-summary__target">
                {" "}
                / {proteinTarget}g
              </span>
            )}
          </span>
        </div>
        <div className="daily-nutrition-summary__row">
          <span className="daily-nutrition-summary__label">Carbs</span>
          <span className="daily-nutrition-summary__value">{totals.carbs}g</span>
        </div>
        <div className="daily-nutrition-summary__row">
          <span className="daily-nutrition-summary__label">Fat</span>
          <span className="daily-nutrition-summary__value">{totals.fat}g</span>
        </div>
      </div>
    </div>
  );
}
