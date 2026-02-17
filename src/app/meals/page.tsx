"use client";

import React, { useState } from "react";
import { MealsPlanResult } from "@/types";
import { useMealsForm } from "@/hooks/useMealsForm";
import { generateMealsPlan } from "@/lib/api-client";
import MealScheduleSection from "@/components/sections/MealScheduleSection";
import MealsResults from "@/components/results/MealsResults";
import WeekNavigation from "@/components/shared/WeekNavigation";

export default function MealsPage() {
  const { formData, updateField, weekOf, setWeekOf, loading } =
    useMealsForm();
  const [result, setResult] = useState<MealsPlanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const plan = await generateMealsPlan(formData, weekOf);
      setResult(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading meals...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container">
        <MealsResults result={result} onBack={() => setResult(null)} />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Meals</h2>
      <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="meal-weekly-focus">Weekly Focus</label>
        <textarea
          id="meal-weekly-focus"
          placeholder="What's your meal focus this week? e.g., high protein, meal prep Sunday, use up pantry items..."
          value={formData.weeklyFocus}
          onChange={(e) => updateField("weeklyFocus", e.target.value)}
          rows={3}
        />
      </div>

      <MealScheduleSection
        meals={formData.meals}
        onUpdate={(meals) => updateField("meals", meals)}
      />

      <button
        type="button"
        className="submit-button"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate Meal Plan"}
      </button>
    </div>
  );
}
