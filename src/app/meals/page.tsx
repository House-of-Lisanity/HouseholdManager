"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MealsPlanResult } from "@/types";
import { useMealsForm } from "@/hooks/useMealsForm";
import { useSavedResult } from "@/hooks/useSavedResult";
import { generateMealsPlan } from "@/lib/api-client";
import MealScheduleSection from "@/components/sections/MealScheduleSection";
import MealsResults from "@/components/results/MealsResults";
import WeekNavigation from "@/components/shared/WeekNavigation";

export default function MealsPage() {
  const router = useRouter();
  const { formData, updateField, weekOf, setWeekOf, loading: formLoading } =
    useMealsForm();
  const {
    result,
    setResult,
    saveResult,
    loading: resultLoading,
  } = useSavedResult<MealsPlanResult>("meals", weekOf);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  if (formLoading || resultLoading) {
    return (
      <div className="container">
        <p>Loading meals...</p>
      </div>
    );
  }

  if (result && !showForm) {
    return (
      <div className="results-page">
        <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />
        <MealsResults
          key={weekOf}
          result={result}
          onBack={() => setShowForm(true)}
          onDataChange={saveResult}
        />
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

      <div className="form-section">
        <h2>Weekly Focus</h2>
        <div className="form-group">
          <label htmlFor="meal-weekly-focus">
            What&apos;s your meal focus this week?
          </label>
          <textarea
            id="meal-weekly-focus"
            placeholder="e.g., high protein, meal prep Sunday, use up pantry items..."
            value={formData.weeklyFocus}
            onChange={(e) => updateField("weeklyFocus", e.target.value)}
            rows={3}
          />
        </div>
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
      {result && (
        <button
          type="button"
          className="preview-button"
          onClick={() => setShowForm(false)}
        >
          View Results
        </button>
      )}
    </div>
  );
}
