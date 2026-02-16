"use client";

import React, { useState } from "react";
import { CalendarPlanResult } from "@/types";
import { useCalendarForm } from "@/hooks/useCalendarForm";
import { generateCalendarPlan } from "@/lib/api-client";
import WeekFocusSection from "@/components/sections/WeekFocusSection";
import GymSessionsSection from "@/components/sections/GymSessionsSection";
import EventsSection from "@/components/sections/EventsSection";
import CalendarResults from "@/components/results/CalendarResults";

export default function CalendarPage() {
  const { formData, updateField, loading, loadWeek } = useCalendarForm();
  const [result, setResult] = useState<CalendarPlanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="container">
        <p>Loading calendar...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container">
        <CalendarResults result={result} onBack={() => setResult(null)} />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Calendar</h2>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <WeekFocusSection
        formData={formData}
        onChange={updateField}
        onWeekChange={loadWeek}
      />

      <GymSessionsSection
        sessions={formData.gymSessions}
        onUpdate={(sessions) => updateField("gymSessions", sessions)}
      />

      <EventsSection
        events={formData.oneOffItems}
        onUpdate={(events) => updateField("oneOffItems", events)}
      />

      <div className="form-section">
        <h2>Schedule Notes</h2>
        <div className="form-group">
          <label htmlFor="conflicts">
            Conflicts or special notes for this week:
          </label>
          <textarea
            id="conflicts"
            placeholder="e.g., dentist appointment Tuesday, working from home Friday..."
            value={formData.scheduleConflicts}
            onChange={(e) => updateField("scheduleConflicts", e.target.value)}
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
    </div>
  );
}
