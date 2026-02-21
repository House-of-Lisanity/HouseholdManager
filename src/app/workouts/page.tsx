"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutsPlanResult } from "@/types";
import { useWorkoutsForm } from "@/hooks/useWorkoutsForm";
import { generateWorkoutsPlan } from "@/lib/api-client";
import WorkoutScheduleSection from "@/components/sections/WorkoutScheduleSection";
import WorkoutsResults from "@/components/results/WorkoutsResults";
import WeekNavigation from "@/components/shared/WeekNavigation";

export default function WorkoutsPage() {
  const router = useRouter();
  const { formData, updateField, weekOf, setWeekOf, loading } = useWorkoutsForm();
  const [result, setResult] = useState<WorkoutsPlanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const plan = await generateWorkoutsPlan(formData, weekOf);
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
        <p>Loading workouts...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container">
        <WorkoutsResults result={result} onBack={() => setResult(null)} />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Workouts</h2>
      <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="weekly-focus">Weekly Focus</label>
        <textarea
          id="weekly-focus"
          placeholder="What do you want to focus on this week? e.g., glutes and conditioning, upper body strength..."
          value={formData.weeklyFocus}
          onChange={(e) => updateField("weeklyFocus", e.target.value)}
          rows={3}
        />
      </div>

      <WorkoutScheduleSection
        workouts={formData.workouts}
        onUpdate={(workouts) => updateField("workouts", workouts)}
      />

      <button
        type="button"
        className="submit-button"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate Workout Plan"}
      </button>
      <button
        type="button"
        className="preview-button"
        onClick={() => router.push("/results")}
      >
        Preview with Sample Data
      </button>
    </div>
  );
}
