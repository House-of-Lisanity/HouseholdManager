import React, { useState } from "react";
import { MealLog } from "@/types";
import { MEAL_SLOTS } from "@/lib/constants";
import { estimateNutrition } from "@/lib/api-client";
import { parseNutritionLabel } from "@/lib/nutrition-label-parser";

interface MealLogFormProps {
  initialData: Omit<MealLog, "_id"> & { _id?: string };
  onSave: (log: Omit<MealLog, "_id"> & { _id?: string }) => void;
  onCancel: () => void;
  plannedDescription?: string;
}

export default function MealLogForm({
  initialData,
  onSave,
  onCancel,
  plannedDescription,
}: MealLogFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNutrition = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: value },
    }));
  };

  const handleEstimate = async () => {
    if (!formData.description.trim()) return;

    setEstimateError(null);

    // Try parsing as a nutrition label first (e.g., pasted from Tovala)
    const parsed = parseNutritionLabel(formData.description);
    if (parsed) {
      setFormData((prev) => ({
        ...prev,
        nutrition: parsed.nutrition,
        mealName: prev.mealName || parsed.mealName || "",
      }));
      return;
    }

    // Fall back to AI estimation
    setEstimating(true);
    try {
      const nutrition = await estimateNutrition(formData.description);
      setFormData((prev) => ({ ...prev, nutrition }));
    } catch (err) {
      setEstimateError(
        "Nutrition estimation unavailable — enter manually"
      );
    } finally {
      setEstimating(false);
    }
  };

  const isEditing = Boolean(initialData._id);

  const handleSave = () => {
    onSave({ ...formData, completedAt: new Date().toISOString() });
  };

  return (
    <div className="meal-log-form">
      {plannedDescription && (
        <div className="planned-comparison">
          <strong>Planned:</strong>
          <p>{plannedDescription}</p>
        </div>
      )}

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="meal-log-date">Date</label>
          <input
            id="meal-log-date"
            type="date"
            value={formData.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-log-slot">Meal Slot</label>
          <select
            id="meal-log-slot"
            value={formData.mealSlot}
            onChange={(e) => updateField("mealSlot", e.target.value)}
          >
            <option value="">Select slot...</option>
            {MEAL_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="meal-log-name">Meal Name</label>
        <input
          id="meal-log-name"
          type="text"
          placeholder="e.g., Chicken bowl, Protein shake"
          value={formData.mealName}
          onChange={(e) => updateField("mealName", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="meal-log-description">What did you eat?</label>
        <div className="meal-log-form__estimate-row">
          <textarea
            id="meal-log-description"
            rows={3}
            placeholder="e.g., chicken breast, broccoli, rice-a-roni — or paste a nutrition label"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
          <button
            type="button"
            className="log-button log-button--secondary"
            onClick={handleEstimate}
            disabled={estimating || !formData.description.trim()}
          >
            {estimating ? "Estimating..." : "Estimate Nutrition"}
          </button>
        </div>
        {estimateError && (
          <p className="meal-log-form__estimate-status">{estimateError}</p>
        )}
      </div>

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="meal-log-calories">Calories</label>
          <input
            id="meal-log-calories"
            type="text"
            placeholder="e.g., 350"
            value={formData.nutrition?.calories || ""}
            onChange={(e) => updateNutrition("calories", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-log-protein">Protein (g)</label>
          <input
            id="meal-log-protein"
            type="text"
            placeholder="e.g., 35"
            value={formData.nutrition?.protein || ""}
            onChange={(e) => updateNutrition("protein", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-log-carbs">Carbs (g)</label>
          <input
            id="meal-log-carbs"
            type="text"
            placeholder="e.g., 40"
            value={formData.nutrition?.carbs || ""}
            onChange={(e) => updateNutrition("carbs", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-log-fat">Fat (g)</label>
          <input
            id="meal-log-fat"
            type="text"
            placeholder="e.g., 12"
            value={formData.nutrition?.fat || ""}
            onChange={(e) => updateNutrition("fat", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="meal-log-notes">Notes</label>
        <input
          id="meal-log-notes"
          type="text"
          placeholder="Optional notes"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button className="save-button" onClick={handleSave}>
          {isEditing ? "Update Log" : "Save Log"}
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
