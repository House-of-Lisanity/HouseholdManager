"use client";

import React, { useState } from "react";
import { TovalaMeal, MealsPlanResult } from "@/types";
import { useMealsForm } from "@/hooks/useMealsForm";
import { generateMealsPlan } from "@/lib/api-client";
import TovalaMealsSection from "@/components/sections/TovalaMealsSection";
import CustomMealsSection from "@/components/sections/CustomMealsSection";
import MealsResults from "@/components/results/MealsResults";

export default function MealsPage() {
  const { formData, updateField, weekOf, loading } = useMealsForm();
  const [result, setResult] = useState<MealsPlanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTovalaMealChange = (
    index: number,
    field: keyof TovalaMeal,
    value: string
  ) => {
    const updated = [...formData.tovalaMeals];
    updated[index] = { ...updated[index], [field]: value };
    updateField("tovalaMeals", updated);
  };

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

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <TovalaMealsSection
        meals={formData.tovalaMeals}
        onUpdate={handleTovalaMealChange}
      />

      <CustomMealsSection
        meals={formData.customMeals}
        onUpdate={(meals) => updateField("customMeals", meals)}
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
