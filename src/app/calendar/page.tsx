"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlanResult } from "@/types";
import { useCalendarForm } from "@/hooks/useCalendarForm";
import { useSavedResult } from "@/hooks/useSavedResult";
import { generateCalendarPlan } from "@/lib/api-client";
import WeekNavigation from "@/components/shared/WeekNavigation";
import EventsSection from "@/components/sections/EventsSection";
import CalendarResults from "@/components/results/CalendarResults";

export default function CalendarPage() {
  const router = useRouter();
  const { formData, updateField, weekOf, setWeekOf, loading: formLoading } =
    useCalendarForm();
  const {
    result,
    setResult,
    saveResult,
    loading: resultLoading,
  } = useSavedResult<CalendarPlanResult>("calendar", weekOf);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const plan = await generateCalendarPlan(formData);
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
        <p>Loading calendar...</p>
      </div>
    );
  }

  if (result && !showForm) {
    return (
      <div className="results-page">
        <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />
        <CalendarResults
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
      <h2>Calendar</h2>
      <WeekNavigation weekOf={weekOf} onChange={setWeekOf} />

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <EventsSection
        events={formData.oneOffItems}
        onUpdate={(events) => updateField("oneOffItems", events)}
      />

      <div className="form-section">
        <h2>Weekly Notes</h2>
        <div className="form-group">
          <label htmlFor="weekly-notes">
            Goals, priorities, or notes for this week:
          </label>
          <textarea
            id="weekly-notes"
            placeholder="e.g., This week I need to finish painting the bathroom, inspector coming Tuesday..."
            value={formData.weeklyNotes}
            onChange={(e) => updateField("weeklyNotes", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <button
        type="button"
        className="submit-button"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate Calendar Plan"}
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
